import React from "react";
import "./SideBar.css";

const SideBar: React.FC = () => {
    return (
        <aside className="sidebar">
            <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/orders">Orders</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/settings">Settings</a></li>
            </ul>
        </aside>
    );
};

export default SideBar;