package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

// Clave secreta para firmar los JWT (idealmente guardada en un .env)
var jwtKey = []byte("super_secreta_llave_codestore_123")

// 1. ESTRUCTURAS
type Usuario struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"` // Solo se usa al recibir en login/registro
}

type Recurso struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Category    string `json:"category"`
	Difficulty  string `json:"difficulty"`
	Type        string `json:"type"`
	Description string `json:"description"`
	CodeContent string `json:"code_content"`
	UsuarioID   int    `json:"usuario_id,omitempty"`
	Username    string `json:"username,omitempty"` // Para mostrar "Subido por..."
}

// Claims para el JWT
type Claims struct {
	UsuarioID int    `json:"usuario_id"`
	Username  string `json:"username"`
	jwt.RegisteredClaims
}

func main() {
	// CONFIGURACIÓN DE LA BASE DE DATOS
	connStr := "host=localhost port=5432 user=Biborita password=Bina0010db dbname=DataBase_CodeStore sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error al abrir la base de datos: ", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("No se pudo conectar a la base de datos: ", err)
	}
	fmt.Println("🚀 ¡Conexión exitosa a PostgreSQL!")

	// ENRUTADOR
	router := mux.NewRouter()

	// RUTAS PÚBLICAS
	router.HandleFunc("/api/status", healthCheck).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/recursos", getRecursos).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/recursos/{id}", getRecursoByID).Methods("GET", "OPTIONS")

	// RUTAS DE AUTENTICACIÓN
	router.HandleFunc("/api/registro", registerUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/login", loginUser).Methods("POST", "OPTIONS")

	// RUTAS PROTEGIDAS (Admin Global)
	// Envovemos estas rutas en el Middleware de Autenticación
	protected := router.PathPrefix("/api").Subrouter()
	protected.Use(AuthMiddleware)
	protected.HandleFunc("/recursos", createRecurso).Methods("POST", "OPTIONS")
	protected.HandleFunc("/recursos/{id}", updateRecurso).Methods("PUT", "OPTIONS")
	protected.HandleFunc("/recursos/{id}", deleteRecurso).Methods("DELETE", "OPTIONS")

	// CONFIGURACIÓN DE CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	handler := c.Handler(router)

	fmt.Println("🛡️ Servidor de Code-Store protegido con JWT corriendo en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

// ==========================================================
// MIDDLEWARE DE AUTENTICACIÓN
// ==========================================================
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Ignorar peticiones OPTIONS (Preflight de CORS)
		if r.Method == "OPTIONS" {
			next.ServeHTTP(w, r)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			http.Error(w, `{"error": "Acceso denegado. Se requiere un token JWT"}`, http.StatusUnauthorized)
			return
		}

		tokenString := strings.Split(authHeader, "Bearer ")
		if len(tokenString) != 2 {
			http.Error(w, `{"error": "Formato de token inválido"}`, http.StatusUnauthorized)
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString[1], claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, `{"error": "Token inválido o expirado"}`, http.StatusUnauthorized)
			return
		}

		// Pasamos la verificación. Podemos continuar con la petición.
		next.ServeHTTP(w, r)
	})
}

// ==========================================================
// AUTENTICACIÓN: REGISTRO Y LOGIN
// ==========================================================
func registerUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var creds Usuario
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, `{"error": "Datos inválidos"}`, http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 10)
	if err != nil {
		http.Error(w, `{"error": "Error al encriptar contraseña"}`, http.StatusInternalServerError)
		return
	}

	query := `INSERT INTO Usuario (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id`
	var newID int
	err = db.QueryRow(query, creds.Username, creds.Email, string(hashedPassword)).Scan(&newID)
	if err != nil {
		http.Error(w, `{"error": "El usuario o email ya existe"}`, http.StatusConflict) // 409 Conflict
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Usuario registrado exitosamente"})
}

func loginUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var creds Usuario
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, `{"error": "Datos inválidos"}`, http.StatusBadRequest)
		return
	}

	var storedHash string
	var user Usuario
	query := `SELECT id, username, password_hash FROM Usuario WHERE email=$1`
	err := db.QueryRow(query, creds.Email).Scan(&user.ID, &user.Username, &storedHash)

	if err != nil {
		http.Error(w, `{"error": "Credenciales inválidas"}`, http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(creds.Password))
	if err != nil {
		http.Error(w, `{"error": "Credenciales inválidas"}`, http.StatusUnauthorized)
		return
	}

	// Firmar el Token JWT
	expirationTime := time.Now().Add(24 * time.Hour) // Token válido por 24 horas
	claims := &Claims{
		UsuarioID: user.ID,
		Username:  user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		http.Error(w, `{"error": "Error interno al firmar token"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token":    tokenString,
		"username": user.Username,
	})
}

// ==========================================================
// RUTAS DE RECURSOS (CRUD)
// ==========================================================

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "La API de Code-Store está protegida y en línea.",
	})
}

func getRecursos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	searchQuery := r.URL.Query().Get("q")
	var rows *sql.Rows
	var err error

	// Usamos un JOIN para traer el username del dueño
	baseQuery := `
		SELECT r.id, r.title, r.category, r.difficulty, r.type, COALESCE(u.username, 'Admin') 
		FROM Recurso r 
		LEFT JOIN Usuario u ON r.usuario_id = u.id
	`

	if searchQuery != "" {
		query := baseQuery + " WHERE r.title ILIKE $1 OR r.category ILIKE $1 ORDER BY r.id DESC"
		rows, err = db.Query(query, "%"+searchQuery+"%")
	} else {
		query := baseQuery + " ORDER BY r.id DESC"
		rows, err = db.Query(query)
	}

	if err != nil {
		fmt.Println("Error en la consulta:", err)
		json.NewEncoder(w).Encode([]Recurso{})
		return
	}
	defer rows.Close()

	var recursos []Recurso
	for rows.Next() {
		var rec Recurso
		if err := rows.Scan(&rec.ID, &rec.Title, &rec.Category, &rec.Difficulty, &rec.Type, &rec.Username); err != nil {
			fmt.Println("Error al leer la fila:", err)
			continue
		}
		recursos = append(recursos, rec)
	}

	if recursos == nil {
		recursos = []Recurso{}
	}

	json.NewEncoder(w).Encode(recursos)
}

func getRecursoByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	id := vars["id"]

	var rec Recurso
	query := `
		SELECT r.id, r.title, r.category, r.difficulty, r.type, r.description, r.code_content, COALESCE(u.username, 'Admin') 
		FROM Recurso r 
		LEFT JOIN Usuario u ON r.usuario_id = u.id 
		WHERE r.id = $1
	`
	err := db.QueryRow(query, id).Scan(&rec.ID, &rec.Title, &rec.Category, &rec.Difficulty, &rec.Type, &rec.Description, &rec.CodeContent, &rec.Username)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, `{"error": "Recurso no encontrado"}`, http.StatusNotFound)
			return
		}
		http.Error(w, `{"error": "Error interno del servidor"}`, http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(rec)
}

// Para obtener el ID del usuario directamente en los controladores leyendo el Token (opcionalmente)
func getUserIDFromToken(r *http.Request) int {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return 0
	}
	tokenString := strings.Split(authHeader, "Bearer ")[1]
	claims := &Claims{}
	jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) { return jwtKey, nil })
	return claims.UsuarioID
}

func createRecurso(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var rec Recurso
	if err := json.NewDecoder(r.Body).Decode(&rec); err != nil {
		http.Error(w, `{"error": "Formato de datos inválido"}`, http.StatusBadRequest)
		return
	}

	// Extraemos qué usuario está creando esto gracias a su Token
	usuarioID := getUserIDFromToken(r)

	query := `
		INSERT INTO Recurso (title, category, difficulty, type, description, code_content, usuario_id) 
		VALUES ($1, $2, $3, $4, $5, $6, $7) 
		RETURNING id`

	err := db.QueryRow(query, rec.Title, rec.Category, rec.Difficulty, rec.Type, rec.Description, rec.CodeContent, usuarioID).Scan(&rec.ID)
	if err != nil {
		fmt.Println("Error al insertar en la BD:", err)
		http.Error(w, `{"error": "No se pudo guardar el recurso"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(rec)
}

func updateRecurso(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	id := vars["id"]

	var rec Recurso
	if err := json.NewDecoder(r.Body).Decode(&rec); err != nil {
		http.Error(w, `{"error": "Datos inválidos"}`, http.StatusBadRequest)
		return
	}

	// PERMITIREMOS ACTUALIZAR AUNQUE NO SEA EL DUEÑO ORIGINAL
	query := `UPDATE Recurso SET title=$1, category=$2, difficulty=$3, type=$4, description=$5, code_content=$6 WHERE id=$7`
	_, err := db.Exec(query, rec.Title, rec.Category, rec.Difficulty, rec.Type, rec.Description, rec.CodeContent, id)

	if err != nil {
		http.Error(w, `{"error": "No se pudo actualizar"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Recurso actualizado con éxito"})
}

func deleteRecurso(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	id := vars["id"]

	_, err := db.Exec("DELETE FROM Recurso WHERE id=$1", id)
	if err != nil {
		http.Error(w, `{"error": "No se pudo eliminar"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Recurso eliminado del sistema"})
}
