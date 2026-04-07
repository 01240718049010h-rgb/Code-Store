export const SkeletonCard = () => {
    return (
        // La clase clave aquí es "animate-pulse" de Tailwind
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col h-full animate-pulse">

            {/* CABECERA SIMULADA (Etiquetas) */}
            <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-20 bg-gray-700 rounded-md"></div>
                <div className="h-6 w-24 bg-gray-700 rounded-md"></div>
            </div>

            {/* CUERPO SIMULADO (Título y Categoría) */}
            <div className="flex-1 space-y-3 mt-2">
                <div className="h-6 bg-gray-700 rounded-md w-full"></div>
                <div className="h-6 bg-gray-700 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded-md w-1/2 mt-4"></div>
            </div>

            {/* FOOTER SIMULADO (Botones) */}
            <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                <div className="h-9 flex-1 bg-gray-700 rounded-lg"></div>
                <div className="h-9 w-9 bg-gray-700 rounded-lg shrink-0"></div>
            </div>

        </div>
    );
};