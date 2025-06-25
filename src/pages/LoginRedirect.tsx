import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";

const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
const ALLOWED_ROLES = ["Cliente"]; // Definir roles permitidos

export const LoginRedirect = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [isChecking, setIsChecking] = useState(true);

  const { setRol, setToken } = useAuthStore(
    useShallow((state) => ({
      setToken: state.setToken,
      setRol: state.setRol,
    }))
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInDB = async () => {
      if (isLoading || !isAuthenticated || !user) {
        setIsChecking(false);
        return;
      }
      
      const sub = user.sub;
      const rol = user[`${VITE_AUTH0_AUDIENCE}/roles`]?.[0]; // extraer rol del token custom claim o user object
  
      try {
        // Verificar si el rol es permitido
        if (rol && !ALLOWED_ROLES.includes(rol)) {
          console.log(`Rol no permitido: ${rol}. Redirigiendo a acceso denegado.`);
          navigate("/access-denied");
          return;
        }

        const token = await getAccessTokenSilently();
        setToken(token);
        
        if (!rol) {
          setRol(null);
          const response = await axios.post(
            `http://localhost:8080/api/clientes/getUserById`,
            {
              auth0Id: sub,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Si existe, reviso firstLogin
          if (!response.data) {
            navigate("/post-login");
          } else {
            // Si el usuario existe pero no tiene rol asignado, le asignamos el rol Cliente
            setRol("Cliente");
            navigate("/menu");
          }
        } else {
          setRol(rol);
          // Si el rol es cliente, redirigimos a menu
          navigate("/menu");
        }
      } catch (error: any) {
        if (error.response?.status === 404 && !rol) {
          navigate("/post-login");
        } else {
          console.error("Error al consultar usuario", error);
          navigate("/");
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkUserInDB();
  }, [isAuthenticated, isLoading, user]);

  if (isLoading || isChecking) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50dvh",
        }}
      >
        <h2>Verificando acceso...</h2>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #ff6b35',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginTop: '20px'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50dvh",
      }}
    >
      <h2>Redirigiendo...</h2>
    </div>
  );
};

