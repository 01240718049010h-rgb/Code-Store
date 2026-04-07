import { useMochila } from '../../context/MochilaContext';
import { useAuth } from '../../context/AuthContext';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const Layout = () => {
    const location = useLocation();
    const { mochila } = useMochila();
    const { isAuthenticated, logout, username } = useAuth();

    //Guardará el nombre exacto de la categoría seleccionada.
    const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

    // ESTADO PARA DIFICULTAD
    const DIFICULTADES = ['Todos', 'Básico', 'Intermedio', 'Experto'] as const;
    const sliderColors = ['accent-cyan-500', 'accent-green-400', 'accent-yellow-400', 'accent-red-400'];
    const [dificultadIndex, setDificultadIndex] = useState<number>(0);
    const dificultadActiva = DIFICULTADES[dificultadIndex];

    return (
        <div className="dark min-h-screen bg-gray-900 text-white flex flex-col font-sans">

            {/* HEADER (Navbar estilo Tienda) */}
            <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
                
                {/* IZQUIERDA: Logo */}
                <div className="flex items-center gap-4 w-1/3">
                    <Link to="/" className="text-2xl font-bold text-green-400 tracking-wider hover:scale-105 transition-transform">
                        Code<span className="text-white">Store</span>
                    </Link>
                </div>

                {/* CENTRO: Bienvenida del Usuario (Opcional) */}
                <div className="flex-1 flex justify-center w-1/3">
                    {isAuthenticated && (
                        <span className="text-sm text-gray-400 hidden sm:inline-block animate-fade-in">
                            ¡Hola, <strong className="text-cyan-400">{username}</strong>! Bienvenido a tu repositorio.
                        </span>
                    )}
                </div>

                {/* DERECHA: Navegación Principal */}
                <div className="flex items-center justify-end gap-6 font-medium w-1/3">
                    <Link
                        to="/mochila"
                        className={`relative flex items-center gap-2 hover:text-cyan-400 transition-colors ${location.pathname === '/mochila' ? 'text-cyan-400' : 'text-gray-300'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        <span className="hidden lg:inline">Mi Mochila</span>
                        {mochila.length > 0 && (
                            <span className="absolute -top-1.5 -right-3 lg:-right-4 bg-cyan-600 shadow-[0_0_8px_rgba(6,182,212,0.8)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                {mochila.length}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/admin"
                                className={`hover:text-green-400 transition-colors ${location.pathname === '/admin' ? 'text-green-400' : 'text-gray-300'}`}
                            >
                                Panel Admin
                            </Link>
                            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                                Salir
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-cyan-700/20 text-cyan-400 hover:bg-cyan-600 hover:text-white px-4 py-1.5 rounded-lg transition-colors border border-cyan-800/50"
                        >
                            Acceder
                        </Link>
                    )}
                </div>
            </nav>

            {/* CONTENEDOR INFERIOR (Sidebar + Contenido) */}
            <div className="flex flex-1 overflow-hidden">

                {/* SIDEBAR (Filtros del Marketplace) */}
                <aside className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto hidden md:block shadow-lg">
                    <div className="p-5">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pasillos Virtuales</h3>
                        <ul className="space-y-2">
                            {/* Botón para quitar los filtros */}
                            <li>
                                <button
                                    onClick={() => setCategoriaActiva(null)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3
                                ${categoriaActiva === null
                                            ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                    <span>🌐</span> Todo el Repositorio
                                </button>
                            </li>

                            {/* Categoría 1 */}
                            <li>
                                <button
                                    onClick={() => setCategoriaActiva('Árboles y Grafos')}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3
                                ${categoriaActiva === 'Árboles y Grafos'
                                            ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                    <span>🌲</span> Árboles y Grafos
                                </button>
                            </li>

                            {/* Categoría 2 */}
                            <li>
                                <button
                                    onClick={() => setCategoriaActiva('Ordenamiento Externo')}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3
                                ${categoriaActiva === 'Ordenamiento Externo'
                                            ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                    <span>⚙️</span> Ordenamiento Externo
                                </button>
                            </li>

                            {/* Categoría 3 */}
                            <li>
                                <button
                                    onClick={() => setCategoriaActiva('POO y Polimorfismo')}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3
                                ${categoriaActiva === 'POO y Polimorfismo'
                                            ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                    <span>🧩</span> POO y Polimorfismo
                                </button>
                            </li>

                            {/* Categoría 4 */}
                            <li>
                                <button
                                    onClick={() => setCategoriaActiva('Manejo de Excepciones')}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3
                                ${categoriaActiva === 'Manejo de Excepciones'
                                            ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                    <span>⚠️</span> Manejo de Excepciones
                                </button>
                            </li>
                        </ul>

                        <hr className="border-gray-700 my-6" />

                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Dificultad Cognitiva</h3>
                        <div className="px-2">
                            <div className="flex justify-between text-xs mb-2">
                                <span className={dificultadIndex === 0 ? "text-cyan-400 font-bold" : "text-gray-500"}>Todos</span>
                                <span className={dificultadIndex === 3 ? "text-red-400 font-bold" : "text-gray-500"}>Experto</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="3"
                                value={dificultadIndex}
                                onChange={(e) => setDificultadIndex(Number(e.target.value))}
                                className={`w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer ${sliderColors[dificultadIndex]} transition-colors`}
                            />
                            <div className="text-center mt-3 font-semibold text-sm">
                                {dificultadIndex === 0 && <span className="text-cyan-400">Todos los Niveles</span>}
                                {dificultadIndex === 1 && <span className="text-green-400">Nivel Básico</span>}
                                {dificultadIndex === 2 && <span className="text-yellow-400">Nivel Intermedio</span>}
                                {dificultadIndex === 3 && <span className="text-red-400">Nivel Experto</span>}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ÁREA DE CONTENIDO PRINCIPAL (El Outlet inyecta las pantallas aquí) */}
                <main className="flex-1 overflow-y-auto bg-gray-900 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet context={{ categoriaActiva, setCategoriaActiva, dificultadActiva }} />
                    </div>
                </main>
            </div>

        </div>
    );
};