package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "host=localhost port=5432 user=Biborita password=Bina0010db dbname=DataBase_CodeStore sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting: ", err)
	}
	defer db.Close()

	// 1. Create Usuario table
	createUsersQuery := `
		CREATE TABLE IF NOT EXISTS Usuario (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`
	_, err = db.Exec(createUsersQuery)
	if err != nil {
		log.Fatal("Error creating Usuario table: ", err)
	}
	fmt.Println("✅ Table 'Usuario' created or verified.")

	// 2. Insert a default Admin user so that existing resources don't break when we add the FK
	// Password will be 'admin123' (we'll hash it properly in the go code later, but for now we'll put a dummy or a bcrypt hash)
	// We'll insert a dummy user to satisfy the foreign key constraint
	dummyUserQuery := `
		INSERT INTO Usuario (username, email, password_hash) 
		VALUES ('AdminInicial', 'admin@codestore.com', 'dummy_hash_to_be_replaced')
		ON CONFLICT (username) DO NOTHING;
	`
	_, err = db.Exec(dummyUserQuery)
	if err != nil {
		log.Printf("Warning inserting dummy user: %v", err)
	}

	var defaultUserId int
	err = db.QueryRow("SELECT id FROM Usuario WHERE username='AdminInicial' LIMIT 1").Scan(&defaultUserId)
	if err != nil {
		log.Fatal("Could not get fallback user id:", err)
	}

	// 3. Alter Recurso table to add usuario_id if it doesn't exist
	alterRecursoQuery := `
		ALTER TABLE Recurso 
		ADD COLUMN IF NOT EXISTS usuario_id INT REFERENCES Usuario(id) ON DELETE SET NULL;
	`
	_, err = db.Exec(alterRecursoQuery)
	if err != nil {
		log.Fatal("Error altering Recurso table: ", err)
	}
	fmt.Println("✅ Table 'Recurso' altered successfully.")

	// 4. Update existing records to the default user ID so we don't have NULLs (optional but good idea)
	updateExistingQuery := fmt.Sprintf(`UPDATE Recurso SET usuario_id = %d WHERE usuario_id IS NULL;`, defaultUserId)
	_, err = db.Exec(updateExistingQuery)
	if err != nil {
		log.Fatal("Error updating existing records: ", err)
	}
	fmt.Println("✅ Existing resources linked to the default Admin.")
}
