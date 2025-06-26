import React from 'react';
import { Link } from 'react-router-dom';

const ProfileMenu: React.FC = () => {
    return (
        <div className="profile-menu">
            <h2 className="menu-title">Nombre Usuario</h2>

            <div className="menu-items">
                <Link to="/client/profile/personal-info" className="menu-item">
                    <span className="menu-icon">👤</span>
                    <span className="menu-text">Información Personal</span>
                    <span className="arrow">›</span>
                </Link>

                <Link to="/client/profile/addresses" className="menu-item">
                    <span className="menu-icon">📍</span>
                    <span className="menu-text">Direcciones</span>
                    <span className="arrow">›</span>
                </Link>

                <Link to="/client/orders" className="menu-item">
                    <span className="menu-icon">📋</span>
                    <span className="menu-text">Mis Pedidos</span>
                    <span className="arrow">›</span>
                </Link>

                <Link to="/logout" className="menu-item logout">
                    <span className="menu-icon">🚪</span>
                    <span className="menu-text">Cerrar Sesión</span>
                    <span className="arrow">›</span>
                </Link>
            </div>
        </div>
    );
};

export default ProfileMenu;