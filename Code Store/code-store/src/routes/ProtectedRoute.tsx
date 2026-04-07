import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // Si no está autenticado, lo enviamos al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, dejamos que el React Router ponga el componente dentro (el Outlet)
    return <Outlet />;
};
