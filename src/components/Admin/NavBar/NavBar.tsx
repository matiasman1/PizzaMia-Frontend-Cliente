import React from "react";
import "./NavBar.css";

const NavBar: React.FC = () => {
    return (
        <nav className="navbar">
            <h1>Admin Panel</h1>
            <div className="navbar-links">
                <a href="/profile">Profile</a>
                <a href="/logout">Logout</a>
            </div>
        </nav>
    );
};

export default NavBar;