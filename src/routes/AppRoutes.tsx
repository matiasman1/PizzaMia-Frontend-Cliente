import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/landing';
import Menu from '../pages/menu';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Menu page route */}
        <Route path="/menu" element={<Menu />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;