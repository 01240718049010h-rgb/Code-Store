import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { Login } from '../pages/Login';
import { Marketplace } from '../pages/Marketplace';
import { RecursoDetalle } from '../pages/RecursoDetalle';
import { Mochila } from '../pages/Mochila';

import { AdminPanel } from '../pages/Admin/AdminPanel';
import { CrearRecurso } from '../pages/Admin/CrearRecurso';
import { EditarRecurso } from '../pages/Admin/EditarRecurso';

import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
    return (
        <Routes>
            {/* RUTA PUBLICA SIN LAYOUT */}
            <Route path="/login" element={<Login />} />

            {/* Todas las rutas dentro de Layout */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Marketplace />} />
                <Route path="recurso/:id" element={<RecursoDetalle />} />
                <Route path="mochila" element={<Mochila />} />

                {/* RUTAS EXCLUSIVAS DE ADMINISTRADOR PROTREGIDAS CON JWT */}
                <Route element={<ProtectedRoute />}>
                    <Route path="admin" element={<AdminPanel />} />
                    <Route path="crear-recurso" element={<CrearRecurso />} />
                    <Route path="editar-recurso/:id" element={<EditarRecurso />} />
                </Route>

            </Route>
        </Routes>
    );
};