import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "../../styles/themes/client.css";

const ClientPage: React.FC = () => {
    // Aplicar la clase al body cuando se monta el componente
    useEffect(() => {
        // Guardar la clase anterior del body para restaurarla después
        const originalClass = document.body.className;
        
        // Añadir la clase client-theme
        document.body.classList.add("client-theme");
        
        // Función de limpieza para cuando se desmonte el componente
        return () => {
            document.body.className = originalClass;
        };
    }, []);

    return (
        <div className="client-page">
            {/* Aquí puedes añadir componentes que deban estar presentes en todas las páginas del cliente */}
            <Outlet />
        </div>
    );
};

export default ClientPage;
