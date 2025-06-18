import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";

const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

export const LoginRedirect = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();

  const { setRol, setToken } = useAuthStore(
    useShallow((state) => ({
      setToken: state.setToken,
      setRol: state.setRol,
    }))
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInDB = async () => {
      if (isLoading || !isAuthenticated || !user) return;
      
      const sub = user.sub;
      const rol = user[`${VITE_AUTH0_AUDIENCE}/roles`]?.[0]; // extraer rol del token custom claim o user object
  
      try {
        const token = await getAccessTokenSilently();
        setToken(token);
        
        if (rol === undefined || rol === null || !rol) {
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
          }
        } else {
          setRol(rol);
          // Si no es cliente, redirijo directo a la ruta del rol
          navigate(`/${rol}`);
        }
      } catch (error: any) {
        if (error.response?.status === 404 && !rol) {
          navigate("/post-login");
        } else {
          console.error("Error al consultar usuario", error);
          navigate("/");
        }
      }
    };

    checkUserInDB();
  }, [isAuthenticated, isLoading, user]);

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

