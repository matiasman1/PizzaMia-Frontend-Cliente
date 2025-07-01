// components/Screens/CallbackPage.tsx
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export const CallbackPage = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error("Auth0 error:", error);

        // Verificar si el error es por cuenta bloqueada
        if (
          error.message?.includes("blocked") ||
          error.message?.includes("account_blocked") 
          
        ) {
          console.log("Usuario bloqueado detectado:", error);
          navigate("/user-blocked");
          return;
        }

        // Otros errores de Auth0
        if (error.message?.includes("access_denied")) {
          navigate("/access-denied");
          return;
        }

        // Error genérico
        console.error("Error de autenticación:", error);
        navigate("/?error=auth_error");
        return;
      }

      if (isAuthenticated) {
        navigate("/login-redirect");
      }
    }
  }, [isLoading, isAuthenticated, error, navigate]);

  if (error) {
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
        <h2>Error en el inicio de sesión</h2>
        <p>Redirigiendo...</p>
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
      <h2>Procesando inicio de sesión...</h2>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #ff6b35",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginTop: "20px",
        }}
      ></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
