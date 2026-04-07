import { Link } from 'react-router-dom';
import { useMochila } from '../../context/MochilaContext';

// Definimos la estructura de datos que la tarjeta necesita
export interface Resource {
    id: string | number;
    title: string;
    category: string;
    difficulty: 'Básico' | 'Intermedio' | 'Experto';
    type: string;
    username?: string;
}

interface ResourceCardProps {
    resource: Resource;
}

export const ResourceCard = ({ resource }: ResourceCardProps) => {
    const { agregarAMochila } = useMochila();

    // Diccionario de colores dependiendo de la dificultad
    const difficultyColors = {
        'Básico': 'text-green-400 bg-green-400/10 border-green-400/20',
        'Intermedio': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        'Experto': 'text-red-400 bg-red-400/10 border-red-400/20',
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col h-full hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 group">

            {/* CABECERA: Etiquetas de Tipo y Dificultad */}
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-700 text-gray-300 border border-gray-600 uppercase tracking-wider">
                    {resource.type}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${difficultyColors[resource.difficulty as keyof typeof difficultyColors] || difficultyColors['Básico']}`}>
                    {resource.difficulty}
                </span>
            </div>

            {/* CUERPO: Título y Categoría */}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {resource.title}
                    </h3>
                </div>
                {resource.username && (
                    <p className="text-[11px] text-gray-500 mb-2 italic tracking-wide">Subido por <span className="font-semibold text-gray-400">{resource.username}</span></p>
                )}
                <p className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
                    {/* Icono de carpeta */}
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    {resource.category}
                </p>
            </div>

            {/* FOOTER: Botones de Acción */}
            <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                <Link
                    to={`/recurso/${resource.id}`}
                    className="flex-1 text-center bg-gray-700 hover:bg-cyan-600 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)] text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                    Ver Código
                </Link>
                <button
                    onClick={() => agregarAMochila(resource)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-transform active:scale-95 flex items-center justify-center shadow-lg shadow-cyan-900/50"
                    title="Guardar en Mochila"
                >
                    {/* Icono de Guardar (Bookmark) */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                </button>
            </div>

        </div>
    );
};