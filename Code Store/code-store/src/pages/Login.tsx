import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    // Estado para alternar entre Login y Registro
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Importamos la función de nuestro AuthContext

    // Estados del formulario
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg(''); // Limpiar errores al escribir
    };

    // Función para comunicarse con el Backend (Go)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const url = isLogin ? 'http://localhost:8080/api/login' : 'http://localhost:8080/api/registro';
            
            // Si es login, Go puede que no necesite el username, pero se lo enviamos igual
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                // Verificamos si el servidor devolvió un texto plano o un JSON fallido
                let errMsg = `Error del servidor (${res.status})`;
                try {
                    const errorData = await res.json();
                    errMsg = errorData.error || errMsg;
                } catch (e) {
                    // Si no se puede parsear a JSON, mostramos el texto que devolvió o un error genérico
                    const text = await res.text();
                    errMsg = text || errMsg;
                }
                throw new Error(errMsg);
            }

            const data = await res.json();

            if (isLogin) {
                // Si es un login exitoso, Guardamos el JWT y el Usuario
                login(data.token, data.username);
                navigate('/admin'); // Redirigimos al panel
            } else {
                // Si registró exitosamente, lo pasamos al estado de Login
                alert('¡Registro Exitoso! Ahora puedes iniciar sesión.');
                setIsLogin(true);
            }
            
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 animate-fade-in relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl relative z-10">

                {/* LOGO */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-400 tracking-wider">
                        Code<span className="text-white">Store</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        {isLogin ? 'Bienvenido de vuelta al repositorio.' : 'Únete al marketplace de algoritmos.'}
                    </p>
                </div>

                {/* SELECTOR LOGIN / REGISTRO */}
                <div className="flex bg-gray-900 rounded-lg p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${isLogin ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${!isLogin ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Registrarse
                    </button>
                </div>

                {/* ALERTA DE ERROR */}
                {errorMsg && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center font-medium">
                        ⚠️ {errorMsg}
                    </div>
                )}

                {/* FORMULARIO PRINCIPAL */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Campo Nombre (Solo visible en Registro) */}
                    {!isLogin && (
                        <div className="animate-fade-in">
                            <label className="block mb-2 text-sm font-medium text-gray-300">Nombre de Desarrollador</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required={!isLogin}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                placeholder="Ej. Linus Torvalds"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                            placeholder="tu@correo.universitario.edu"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'} font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors shadow-lg shadow-cyan-900/30 mt-2`}
                    >
                        {isLoading 
                            ? 'Procesando...' 
                            : (isLogin ? 'Acceder al Sistema' : 'Crear mi Repositorio')
                        }
                    </button>
                </form>

            </div>
        </div>
    );
};