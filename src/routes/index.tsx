import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage.tsx';
import ClientPage from '../pages/client/ClientPage.tsx';
import AdminPage from '../pages/admin/AdminPage.tsx';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Ruta para la landing page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Rutas para el cliente */}
                <Route path="/client/*" element={<ClientPage />} />
                
                {/* Rutas para el administrador */}
                <Route path="/admin/*" element={<AdminPage />} />
                
            </Routes>
        </Router>
    );
};

export default AppRoutes;