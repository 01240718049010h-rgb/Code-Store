import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import type { Resource } from '../components/ui/ResourceCard';

// Definimos qué funciones y datos tendrá nuestro contexto
interface MochilaContextType {
    mochila: Resource[];
    agregarAMochila: (recurso: Resource) => void;
    quitarDeMochila: (id: string | number) => void;
    limpiarMochila: () => void;
}

const MochilaContext = createContext<MochilaContextType | undefined>(undefined);

export const MochilaProvider = ({ children }: { children: ReactNode }) => {
    // Inicializamos el estado intentando leer del localStorage para persistencia
    const [mochila, setMochila] = useState<Resource[]>(() => {
        try {
            const item = window.localStorage.getItem('mochila_codestore');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    });

    // Guardamos en localStorage cada vez que la mochila cambia
    useEffect(() => {
        window.localStorage.setItem('mochila_codestore', JSON.stringify(mochila));
    }, [mochila]);

    const agregarAMochila = (recurso: Resource) => {
        // Evitamos duplicados: solo lo agrega si no está ya en la mochila
        if (!mochila.find(r => r.id === recurso.id)) {
            setMochila([...mochila, recurso]);
        }
    };

    const quitarDeMochila = (id: string | number) => {
        setMochila(mochila.filter(r => r.id !== id));
    };

    const limpiarMochila = () => {
        setMochila([]);
    };

    return (
        <MochilaContext.Provider value={{ mochila, agregarAMochila, quitarDeMochila, limpiarMochila }}>
            {children}
        </MochilaContext.Provider>
    );
};

// Hook personalizado para usar la mochila fácilmente
export const useMochila = () => {
    const context = useContext(MochilaContext);
    if (!context) throw new Error("useMochila debe usarse dentro de un MochilaProvider");
    return context;
};