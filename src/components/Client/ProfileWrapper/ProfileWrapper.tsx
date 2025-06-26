import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProfileWrapperProps {
  children: React.ReactNode;
}

const ProfileWrapper: React.FC<ProfileWrapperProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialRenderDone = useRef(false);

  useEffect(() => {
    // Esta lógica solo debe ejecutarse una vez, en el montaje inicial del componente
    if (!initialRenderDone.current) {
      initialRenderDone.current = true;
      
      let isPageRefresh = false;
      
      if (window.performance) {
        const navEntries = window.performance.getEntriesByType('navigation');
        
        if (navEntries.length > 0) {
          const navEntry = navEntries[0] as PerformanceNavigationTiming;
          isPageRefresh = navEntry.type === 'reload';
        } else {
          // Fallback para navegadores más antiguos
          const hasSession = sessionStorage.getItem('profileSession');
          if (!hasSession) {
            sessionStorage.setItem('profileSession', 'true');
            isPageRefresh = false;
          } else {
            isPageRefresh = true;
          }
        }
      }
      
      // Verificar si estamos en una sección del perfil
      const isProfileSection = location.pathname.includes('/client/profile') || 
                              location.pathname.includes('/client/orders');
      
      // Si es una recarga y estamos en una sección del perfil, redirigir
      if (isPageRefresh && isProfileSection) {
        navigate('/client/profile/personal-info', { replace: true });
      }
    }
    
    // No incluimos dependencias para que este efecto solo se ejecute al montar el componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default ProfileWrapper;