import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage.tsx';
import ClientPage from '../pages/client/ClientPage.tsx';
import AdminPage from '../pages/admin/AdminPage.tsx';
import LoginAdmin from '../pages/admin/LoginAdmin/LoginAdmin'; 



const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Ruta para la landing page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Rutas para el cliente */}
                <Route path="/client/*" element={<ClientPage />} />
                
                {/* Ruta de login para el administrador */}
                <Route path="/admin/login" element={<LoginAdmin />} />
                
                {/* Rutas para el administrador */}
                {/* Redirigir la ruta administracion para que siempre vaya a roles por defecto */}
                <Route path="/admin/administracion" element={<Navigate to="/admin/administracion/roles" replace />} />
                <Route path="/admin/rubros" element={<Navigate to="/admin/rubros/insumos" replace />} />
                
                {/* Rutas específicas para la sección administración */}
                <Route path="/admin/administracion/:section" element={<AdminPage />} />
                <Route path="/admin/rubros/:section" element={<AdminPage />} />
                
                {/* Otras rutas del admin */}
                <Route path="/admin/rubros" element={<AdminPage />} />
                <Route path="/admin/insumos" element={<AdminPage />} />
                <Route path="/admin/productos" element={<AdminPage />} />
                <Route path="/admin/gestion" element={<AdminPage />} />
                <Route path="/admin/estadisticas" element={<AdminPage />} />
                <Route path="/admin/seguridad" element={<AdminPage />} />
                
                {/* Ruta por defecto para admin */}
                <Route path="/admin" element={<Navigate to="/admin/administracion/roles" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;