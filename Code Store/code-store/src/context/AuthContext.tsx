import { createContext, useState, useContext, type ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    login: (token: string, username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => {
        return window.localStorage.getItem('jwt_codestore');
    });

    const [username, setUsername] = useState<string | null>(() => {
        return window.localStorage.getItem('user_codestore');
    });

    // Validamos que haya token
    const isAuthenticated = !!token;

    const login = (newToken: string, newUsername: string) => {
        setToken(newToken);
        setUsername(newUsername);
        window.localStorage.setItem('jwt_codestore', newToken);
        window.localStorage.setItem('user_codestore', newUsername);
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        window.localStorage.removeItem('jwt_codestore');
        window.localStorage.removeItem('user_codestore');
    };


    return (
        <AuthContext.Provider value={{ token, username, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};
