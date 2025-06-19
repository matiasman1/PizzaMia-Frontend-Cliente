import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useShallow } from "zustand/shallow";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const { setRol, setToken } = useAuthStore(
    useShallow((state) => ({
      setToken: state.setToken,
      setRol: state.setRol,
    }))
  );

  useEffect(() => {
    const handleAuth = async () => {
      try {
        if (!isAuthenticated || !user) {
          setIsAuthorized(false);
          return;
        }

        // Obtener token de Auth0
        const token = await getAccessTokenSilently();
        console.log("Token obtenido:", token ? "Sí" : "No");
        setToken(token);

        // Obtener rol del usuario
        const userRoleKey = `${VITE_AUTH0_AUDIENCE}/roles`;
        console.log("Buscando rol en:", userRoleKey);
        console.log("User:", user);
        
        const rol = user[userRoleKey]?.[0];
        console.log("Rol encontrado:", rol);

        if (rol) {
          setRol(rol);
          
          // Verificar si el rol está permitido
          const hasAllowedRole = allowedRoles.includes(rol);
          console.log("¿Rol permitido?:", hasAllowedRole, "Roles permitidos:", allowedRoles);
          setIsAuthorized(hasAllowedRole);
        } else {
          console.warn("No se encontró un rol para el usuario");
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error en la autenticación:", error);
        setIsAuthorized(false);
      }
    };

    if (isAuthenticated && user && isAuthorized === null) {
      handleAuth();
    } else if (!isLoading && !isAuthenticated) {
      setIsAuthorized(false);
    }
  }, [isAuthenticated, user, getAccessTokenSilently, allowedRoles, setRol, setToken, isAuthorized, isLoading]);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading || isAuthorized === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Sen, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #ff6b35',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Verificando permisos...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Redireccionar si no está autorizado
  if (!isAuthorized) {
    console.log("No autorizado. Redirigiendo...");
    return <Navigate to="/" />;
  }

  // Si está autorizado, mostrar el contenido protegido
  return <>{children}</>;
};
