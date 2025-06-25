import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from '../pages/menu/Menu/Menu';
import { LoginRedirect } from '../pages/LoginRedirect';
import { PostLogin } from '../pages/PostLogin/PostLogin';
import LandingPage from '../pages/landing/LandingPage';
import MercadoPagoReturn from '../pages/mercadopago/MercadoPagoReturn';
import { CallbackPage } from '../pages/CallbackPage';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import ClientPage from '../pages/client/ClientPage';
import AccessDenied from '../pages/AccessDenied';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login-redirect" element={<LoginRedirect />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/post-login" element={<PostLogin />} />
      <Route path="/mercadopago/return" element={<MercadoPagoReturn />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      <Route
        path="/cliente"
        element={
          <ProtectedRoute allowedRoles={["Cliente"]}>
            <ClientPage/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;