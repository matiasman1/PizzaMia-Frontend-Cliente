import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage';
import Menu from '../pages/menu/Menu/Menu.tsx';
import ClientPage from '../pages/client/ClientPage.tsx';
import PersonalInfo from '../pages/client/modules/profile/PersonalInfo.tsx';
import Addresses from '../pages/client/modules/profile/Addresses.tsx';
import Orders from '../pages/client/modules/profile/Orders.tsx';
import Cart from '../pages/client/modules/profile/Cart.tsx';
import MercadoPagoReturn from '../pages/mercadopago/MercadoPagoReturn.tsx';


const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Client routes */}
        <Route path="/client/*" element={<ClientPage />} />
        <Route path="/client/profile/personal-info" element={<PersonalInfo />} />
        <Route path="/client/profile/addresses" element={<Addresses />} />
        <Route path="/client/orders" element={<Orders />} />
        <Route path="/client/cart" element={<Cart />} />

        {/* Menu route */}
        <Route path="/menu" element={<Menu />} />
        
        {/* MercadoPago return route */}
        <Route path="/mercadopago/return" element={<MercadoPagoReturn />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;