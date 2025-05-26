import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/themes/admin.css";
import SideBar from "../../components/admin/SideBar/SideBar";
import NavBar from "../../components/admin/NavBar/NavBar";
import "../../styles/themes/admin.css";

// Importar las secciones
import { AdministracionSection } from "./modules/Administracion/AdministracionSection";
import { RubrosSection } from "./modules/Rubros/RubrosSection";
import { InsumosSection } from "./modules/Insumos/InsumosSection";
import { ProductosSection } from "./modules/Productos/ProductosSection";
import { GestionSection }  from "./modules/Gestion/GestionSection";
import { EstadisticasSection } from "./modules/Estadisticas/EstadisticasSection";
import { SeguridadSection } from "./modules/Seguridad/SeguridadSection";

const AdminPage: React.FC = () => {
    const location = useLocation();
    const pathname = location.pathname;
    
    // Renderizar contenido según la ruta actual
    const renderContent = () => {
        if (pathname.startsWith("/admin/administracion")) {
            return <AdministracionSection />;
        }
        if (pathname.startsWith("/admin/rubros")) {
            return <RubrosSection />;
        }
        if (pathname.startsWith("/admin/insumos")) {
            return <InsumosSection />;
        }
        if (pathname.startsWith("/admin/productos")) {
            return <ProductosSection />;
        }
        if (pathname.startsWith("/admin/gestion")) {
            return <GestionSection />;
        }
        if (pathname.startsWith("/admin/estadisticas")) {
            return <EstadisticasSection />;
        }
        if (pathname.startsWith("/admin/seguridad")) {
            return <SeguridadSection />;
        }
        return <AdministracionSection />;
    };

    return (
        <div className="admin-page">
            <NavBar />
            <div className="admin-layout">
                <SideBar />
                <main className="admin-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;