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

                {/* Ruta de login para el administrador */}
                <Route path="/admin/login" element={<LoginAdmin />} />
                
                {/* Rutas para el administrador */}
                <Route path="/admin/*" element={<AdminPage />} />
                
                {/* Ruta por defecto (redirección) */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;