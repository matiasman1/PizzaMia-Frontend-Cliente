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
import PersonalInfo from '../pages/client/modules/profile/PersonalInfo';
import Addresses from '../pages/client/modules/profile/Addresses';
import Orders from '../pages/client/modules/profile/Orders';
import Cart from '../pages/client/modules/profile/Cart';



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




      {/* Rutas protegidas del cliente */}
      <Route
        path="/client/*"
        element={
          <ProtectedRoute allowedRoles={["Cliente"]}>
            <Routes>
              {/* Ruta base del cliente */}
              <Route index element={<ClientPage />} />
              
              {/* Rutas del perfil de usuario */}
              <Route path="profile/personal-info" element={<PersonalInfo />} />
              <Route path="profile/addresses" element={<Addresses />} />
              <Route path="orders" element={<Orders />} />
              <Route path="cart" element={<Cart />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Ruta legacy para compatibilidad */}
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