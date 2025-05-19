import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/themes/admin.css";
import SideBar from "../../components/admin/SideBar/SideBar";
import NavBar from "../../components/admin/NavBar/NavBar";
import "../../styles/themes/admin.css";

// Importar las secciones
import { AdministracionSection } from "./modules/Administracion/AdministracionSection";
import { InsumosSection } from "./modules/Insumos/InsumosSection";
import { ProductosSection } from "./modules/Productos/ProductosSection";
import { GestionSection }  from "./modules/Gestion/GestionSection";
import { EstadisticasSection } from "./modules/Estadisticas/EstadisticasSection";
import { SeguridadSection } from "./modules/Seguridad/SeguridadSection";

const AdminPage: React.FC = () => {
    const location = useLocation();
    const path = location.pathname.split("/").pop() || "";

    // Renderizar contenido según la ruta actual
    const renderContent = () => {
        switch (path) {
            case "administracion":
                return <AdministracionSection />;
            case "insumos":
                return <InsumosSection />;
            case "productos":
                return <ProductosSection />;
            case "gestion":
                return <GestionSection />;
            case "estadisticas":
                return <EstadisticasSection />;
            case "seguridad":
                return <SeguridadSection />;
            default:
                return <AdministracionSection />;
        }
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