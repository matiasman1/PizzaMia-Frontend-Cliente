import React from "react";
import styles from "./NavBar.module.css";

const NavBar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                <h3>PizzaMía</h3>
                <h4>Dashboard</h4>
            </div>
            <div className={styles.rightSection}>
                <a href="/profile">Profile</a>
                <a href="/logout">Logout</a>
            </div>
        </nav>
    );
};

export default NavBar;