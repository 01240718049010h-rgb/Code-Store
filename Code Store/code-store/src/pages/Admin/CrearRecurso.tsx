import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const CrearRecurso = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        title: '',
        category: 'Árboles y Grafos',
        difficulty: 'Básico',
        type: 'Algoritmo',
        description: '',
        code_content: ''
    });

    // Función para actualizar el estado cada vez que escribes algo
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Función que se ejecuta al darle clic a "Guardar Algoritmo"
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue
        setIsLoading(true);

        try {
            // Hacemos el POST a tu API en Go
            const respuesta = await fetch('http://localhost:8080/api/recursos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            // Si todo sale bien, volvemos a la pantalla principal
            navigate('/');
        } catch (error) {
            console.error("Fallo al guardar el recurso:", error);
            alert("Error al conectar con la base de datos.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in pb-12">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Volver al Repositorio Principal
            </Link>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-2">Añadir Nuevo Recurso</h1>
                <p className="text-gray-400 mb-8">Ingresa los datos para registrar un nuevo algoritmo o fragmento en la base de datos.</p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Título y Categoría */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Título del Recurso</label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500"
                                placeholder="Ej: Búsqueda Binaria"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                            <select
                                required
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                            >
                                <option value="Árboles y Grafos">Árboles y Grafos</option>
                                <option value="Ordenamiento Externo">Ordenamiento Externo</option>
                                <option value="POO y Polimorfismo">POO y Polimorfismo</option>
                                <option value="Manejo de Excepciones">Manejo de Excepciones</option>
                            </select>
                        </div>
                    </div>

                    {/* Dificultad y Tipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Dificultad</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                            >
                                <option value="Básico">Básico</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Experto">Experto</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                            >
                                <option value="Algoritmo">Algoritmo</option>
                                <option value="Fragmento">Fragmento</option>
                                <option value="Patrón">Patrón de Diseño</option>
                            </select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500 resize-none"
                            placeholder="Explica brevemente cómo funciona este código..."
                        ></textarea>
                    </div>

                    {/* Contenido del Código */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-400 mb-2">Código Fuente</label>
                        <textarea
                            required
                            name="code_content"
                            value={formData.code_content}
                            onChange={handleChange}
                            rows={8}
                            className="w-full p-4 bg-[#0d1117] border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-green-400 font-mono text-sm placeholder-gray-600 shadow-inner resize-none"
                            placeholder="// Escribe o pega tu código aquí..."
                        ></textarea>
                    </div>

                    {/* Botón de Enviar */}
                    <div className="pt-4 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-cyan-900/30"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Encriptando y Enviando...</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                                    Guardar en la Base de Datos
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};