import { useState, useEffect } from 'react';
import { ResourceCard } from '../components/ui/ResourceCard';
import type { Resource } from '../components/ui/ResourceCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { useMochila } from '../context/MochilaContext';

export const Marketplace = () => {
    const { mochila } = useMochila();
    // Consumimos el estado categoriaActiva y dificultadActiva inyectados desde el Layout (barra lateral)
    const { categoriaActiva, dificultadActiva } = useOutletContext<{ categoriaActiva: string | null, dificultadActiva: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [recursos, setRecursos] = useState<Resource[]>([]);
    // Manejador de la URL para la búsqueda
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || ''; // Leemos lo que dice "?q=" en la URL    

    useEffect(() => {
        const obtenerRecursos = async () => {
            setIsLoading(true); // Encendemos los skeletons al buscar
            try {
                // Le enviamos la palabra clave al backend dinámicamente
                const respuesta = await fetch(`http://localhost:8080/api/recursos?q=${query}`);

                if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

                const datosReales = await respuesta.json();
                setRecursos(datosReales);
            } catch (error) {
                console.error("Fallo la conexión con el servidor Go:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Un pequeño "debounce" visual (retraso)
        const timer = setTimeout(() => {
            obtenerRecursos();
        }, 600);

        return () => clearTimeout(timer);
    }, [query]); // <-- Se vuelve a ejecutar cada vez que cambia 'query'

    // Función que se ejecuta cuando escribimos en la barra
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const texto = e.target.value;
        if (texto) {
            setSearchParams({ q: texto }); // Actualiza la URL
        } else {
            setSearchParams({}); // Limpia la URL si borramos todo
        }
    };

    return (
        <div className="animate-fade-in">

            {/* CABECERA Y BARRA DE BÚSQUEDA */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Explorar Recursos</h1>
                    <p className="text-gray-400">Descubre y guarda fragmentos de código, estructuras y algoritmos.</p>
                </div>

                {/* BARRA DE BÚSQUEDA CYBERPUNK */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        className="block w-full p-3 pl-10 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400 shadow-inner"
                        placeholder="Buscar algoritmos, categorías..."
                    />
                </div>
            </div>

            {/* FEEDBACK VISUAL DE LOS FILTROS */}
            {(categoriaActiva || dificultadActiva !== 'Todos') && (
                <div className="mb-6 p-3 bg-gray-800 border-l-4 border-cyan-500 rounded-r-lg text-sm text-gray-300 flex items-center gap-2 shadow-md">
                    <svg className="w-5 h-5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>
                        Mostrando algoritmos
                        {dificultadActiva !== 'Todos' && ` de nivel `}
                        {dificultadActiva !== 'Todos' && <span className="font-bold text-white">{dificultadActiva}</span>}
                        {categoriaActiva ? ` para el pasillo ` : ` en `}
                        <span className="font-bold text-white">{categoriaActiva || 'Todo el Repositorio'}</span>
                    </span>
                </div>
            )}

            {/* RESULTADOS O SKELETONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
                ) : (() => {
                    // Combinamos el filtro de la Mochila (ocultar) con el filtro de Categoría y la Dificultad
                    const recursosVisibles = recursos.filter(r => {
                        const noEnMochila = !mochila.some(m => m.id === r.id);
                        const coincideCategoria = categoriaActiva ? r.category === categoriaActiva : true;
                        const coincideDificultad = dificultadActiva !== 'Todos' ? r.difficulty === dificultadActiva : true;

                        return noEnMochila && coincideCategoria && coincideDificultad;
                    });

                    if (recursosVisibles.length > 0) {
                        return recursosVisibles.map((recurso) => <ResourceCard key={recurso.id} resource={recurso} />);
                    } else {
                        // Qué pasa si la búsqueda o categoría no encuentra nada
                        return (
                            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                <svg className="mx-auto h-12 w-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-lg font-medium text-gray-300">No hay coincidencias en este pasillo virtual.</p>
                                <p className="text-sm mt-1">Navega a la mochila para ver si ya lo guardaste, o intenta con otra categoría.</p>
                            </div>
                        );
                    }
                })()}
            </div>
        </div>
    );
};