import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage.tsx';
import ClientPage from '../pages/client/ClientPage.tsx';
import AdminPage from '../pages/admin/AdminPage.tsx';
import LoginAdmin from '../pages/admin/LoginAdmin/LoginAdmin'; 
import PersonalInfo from '../pages/client/modules/profile/PersonalInfo.tsx';
import Addresses from '../pages/client/modules/profile/Addresses.tsx';



const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Ruta para la landing page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Rutas para el cliente */}
                <Route path="/client/*" element={<ClientPage />} />
                <Route path="/client/profile/personal-info" element={<PersonalInfo />} />
                <Route path="/client/profile/addresses" element={<Addresses />} />
                
                {/* Redirigir la ruta de cliente para que siempre vaya a perfil por defecto */}

                {/* Ruta de login para el administrador */}
                <Route path="/admin/login" element={<LoginAdmin />} />
                
                {/* Rutas para el administrador */}
                {/* Redirigir la ruta administracion para que siempre vaya a roles por defecto */}
                <Route path="/admin/administracion" element={<Navigate to="/admin/administracion/roles" replace />} />
                
                {/* Rutas específicas para la sección administración */}
                <Route path="/admin/administracion/:section" element={<AdminPage />} />
                
                {/* Otras rutas del admin */}
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