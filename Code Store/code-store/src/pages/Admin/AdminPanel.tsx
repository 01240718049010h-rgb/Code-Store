import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Resource } from '../../components/ui/ResourceCard';
import { useAuth } from '../../context/AuthContext';

export const AdminPanel = () => {
    const { token } = useAuth();
    // 1. ESTADO DE LA TABLA
    const [recursos, setRecursos] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. FUNCIÓN PARA CARGAR RECURSOS DESDE EL BACKEND (Go)
    const cargarRecursos = async () => {
        setIsLoading(true);
        try {
            const respuesta = await fetch('http://localhost:8080/api/recursos');
            if (!respuesta.ok) throw new Error('No se pudieron obtener los recursos');
            const data = await respuesta.json();
            setRecursos(data);
        } catch (error) {
            console.error("Error al cargar recursos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarRecursos();
    }, []);

    // 3. CONTROLADOR PARA ELIMINAR (DELETE)
    const handleDelete = async (id: string | number) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este algoritmo? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:8080/api/recursos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                // Actualizamos el estado local para que desaparezca de la tabla sin recargar toda la página
                setRecursos(recursos.filter(r => r.id !== id));
                alert("Recurso eliminado correctamente.");
            } else {
                alert("Error al eliminar el recurso.");
            }
        } catch (error) {
            console.error("Fallo al eliminar:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };

    return (
        <div className="animate-fade-in space-y-6">

            {/* CABECERA */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Panel de Control (CRUD)</h1>
                <p className="text-gray-400">Gestiona el inventario de tu Code-Store. Añade, edita o elimina recursos de la base de datos.</p>
            </div>

            {/* CONTENEDOR PRINCIPAL: Grid (Botón a la izq, Tabla a la der) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-1">
                    <Link
                        to="/crear-recurso"
                        className="inline-flex items-center justify-center w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-cyan-900/40 group"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Añadir Nuevo Algoritimo
                    </Link>
                </div>

                {/* ================= TABLA DE DATOS (Columnas Derechas) ================= */}
                <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                        <h2 className="text-lg font-semibold text-white">Inventario Actual</h2>
                        <span className="bg-gray-700 text-cyan-400 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-600">
                            {recursos.length} items
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">ID</th>
                                    <th scope="col" className="px-6 py-3">Título</th>
                                    <th scope="col" className="px-6 py-3">Categoría</th>
                                    <th scope="col" className="px-6 py-3">Nivel</th>
                                    <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 animate-pulse">
                                            Cargando base de datos...
                                        </td>
                                    </tr>
                                ) : recursos.length > 0 ? (
                                    recursos.map((recurso) => (
                                        <tr key={recurso.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{recurso.id}</td>
                                            <td className="px-6 py-4 truncate max-w-[200px]" title={recurso.title}>{recurso.title}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-900 text-gray-300 text-xs font-medium px-2 py-1 rounded border border-gray-600">
                                                    {recurso.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md border 
                            ${recurso.difficulty === 'Básico' ? 'text-green-400 border-green-400/20' :
                                                        recurso.difficulty === 'Intermedio' ? 'text-yellow-400 border-yellow-400/20' :
                                                            'text-red-400 border-red-400/20'}`}
                                                >
                                                    {recurso.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <Link
                                                    to={`/editar-recurso/${recurso.id}`}
                                                    className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(recurso.id)}
                                                    className="font-medium text-red-500 hover:text-red-400 hover:underline"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No hay registros en la base de datos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};