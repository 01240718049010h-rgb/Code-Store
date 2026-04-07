import { useMochila } from '../context/MochilaContext';
import { Link } from 'react-router-dom';

export const Mochila = () => {
    const { mochila, quitarDeMochila, limpiarMochila } = useMochila();

    return (
        <div className="max-w-6xl mx-auto animate-fade-in pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="text-cyan-500">🗃️</span> Mi Mochila de Código
                    </h1>
                    <p className="text-gray-400">Recursos guardados para acceso rápido sin conexión a la red central.</p>
                </div>

                {mochila.length > 0 && (
                    <button
                        onClick={limpiarMochila}
                        className="text-red-400 hover:text-red-300 text-sm font-medium border border-red-900/50 px-4 py-2 rounded-lg hover:bg-red-900/20 transition-all"
                    >
                        Vaciar Mochila
                    </button>
                )}
            </div>

            {mochila.length === 0 ? (
                <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-3xl p-20 text-center">
                    <div className="text-6xl mb-6 flex justify-center">🎒</div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">Tu mochila está vacía</h2>
                    <p className="text-gray-500 mb-8">Explora el repositorio y guarda los algoritmos que necesites para tu misión.</p>
                    <Link to="/" className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition-all">
                        Explorar Repositorio
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mochila.map((recurso) => (
                        <div key={recurso.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col h-full hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 group">
                            
                            {/* CABECERA: Etiquetas */}
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-700 text-gray-300 border border-gray-600 uppercase tracking-wider">
                                    {recurso.type}
                                </span>
                            </div>

                            {/* CUERPO: Título y Categoría */}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                                    {recurso.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                                    </svg>
                                    {recurso.category}
                                </p>
                            </div>

                            {/* FOOTER: Botones de Acción */}
                            <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                                <Link
                                    to={`/recurso/${recurso.id}`}
                                    className="flex-1 text-center bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-600/30 text-sm font-medium py-2 px-4 rounded-lg transition-all"
                                >
                                    Ver Código
                                </Link>
                                <button
                                    onClick={() => quitarDeMochila(recurso.id)}
                                    className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 rounded-lg transition-all font-medium"
                                    title="Quitar de la Mochila"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};