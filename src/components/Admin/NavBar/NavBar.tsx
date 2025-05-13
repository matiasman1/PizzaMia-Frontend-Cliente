import React from "react";
import styles from "./NavBar.module.css";
import pizzaLogo from "../../../assets/admin/pizza.svg";

const NavBar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                <div className={styles.logoContainer}>
                    <h3>PizzaMía</h3>
                    <img src={pizzaLogo} alt="Pizza Mía Logo" className={styles.logo} />
                </div>
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