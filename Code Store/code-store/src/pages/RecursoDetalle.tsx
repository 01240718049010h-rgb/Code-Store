import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMochila } from '../context/MochilaContext';

export const RecursoDetalle = () => {
    const { id } = useParams(); // Leemos el ID de la URL
    const [recurso, setRecurso] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { agregarAMochila } = useMochila();

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const respuesta = await fetch(`http://localhost:8080/api/recursos/${id}`);
                if (!respuesta.ok) throw new Error('Recurso no encontrado');

                const data = await respuesta.json();
                setRecurso(data);
            } catch (error) {
                console.error("Error cargando detalle:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetalle();
    }, [id]);

    if (isLoading) {
        return <div className="text-center text-cyan-400 mt-20 animate-pulse">Desencriptando datos del servidor...</div>;
    }

    if (!recurso) {
        return <div className="text-center text-red-500 mt-20">Error 404: Archivo corrupto o no encontrado en el servidor.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-12">
            {/* Botón de regreso */}
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Volver al Repositorio Principal
            </Link>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decoración */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-[60px]"></div>

                {/* Encabezado */}
                <div className="flex flex-wrap items-center justify-between mb-4">
                    <div className="flex gap-3">
                        <span className="px-3 py-1 text-xs font-semibold tracking-wider text-cyan-400 bg-cyan-900/30 border border-cyan-800/50 rounded-full uppercase">
                            {recurso.category}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold tracking-wider text-purple-400 bg-purple-900/30 border border-purple-800/50 rounded-full uppercase">
                            {recurso.difficulty}
                        </span>
                    </div>
                    <button 
                        onClick={() => agregarAMochila(recurso)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all"
                    >
                        Guardar en Mochila
                    </button>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">{recurso.title}</h1>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">{recurso.description}</p>

                {/* Bloque de Código Cyberpunk */}
                <div className="bg-[#0d1117] rounded-xl border border-gray-700 overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
                        <span className="text-xs text-gray-400 font-mono">source_code.{recurso.type === 'Algoritmo' ? 'cpp' : 'txt'}</span>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(recurso.code_content);
                                alert("Código copiado al portapapeles");
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-green-400 font-mono text-sm">
                            <code>{recurso.code_content}</code>
                        </pre>
                    </div>
                </div>

            </div>
        </div>
    );
};