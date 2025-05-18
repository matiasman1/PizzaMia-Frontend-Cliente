import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/themes/admin.css";
import SideBar from "../../components/admin/SideBar/SideBar";
import NavBar from "../../components/admin/NavBar/NavBar";
import "../../styles/themes/admin.css";

// Importar las secciones
import { AdministracionSection } from "./Sections/AdministracionSection";
import { InsumosSection } from "./Sections/InsumosSection";
import { ProductosSection } from "./Sections/ProductosSection";
import { GestionSection }  from "./Sections/GestionSection";
import { EstadisticasSection } from "./Sections/EstadisticasSection";
import { SeguridadSection } from "./Sections/SeguridadSection";

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