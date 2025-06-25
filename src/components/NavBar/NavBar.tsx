import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import pizzaLogo from "../../../assets/admin/pizza.svg";
import avatarLogo from "../../../assets/admin/generic-avatar.svg";
import Button from "../Button/Button";

const NavBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Verifica si hay usuario en localStorage
    const user = localStorage.getItem("user");

    // Cerrar el menú si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(true);
            }
        };
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setMenuOpen(false);
        navigate("/admin/login");
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
                <div className={styles.logoSection}>
                    <h3>PizzaMía</h3>
                    <img src={pizzaLogo} alt="Pizza Mía Logo" className={styles.logo} />
                    <h4 className={styles.dashboardTitle}>Dashboard</h4>
                </div>
                {user && (
                    <div className={styles.rightSection}>
                        <img
                            src={avatarLogo}
                            alt="Avatar"
                            className={styles.avatar}
                            onClick={() => setMenuOpen((open) => !open)}
                            style={{ cursor: "pointer" }}
                        />
                        {menuOpen && (
                            <div className={styles.avatarMenu} ref={menuRef}>
                                <Button
                                    label="Cerrar sesión"
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;