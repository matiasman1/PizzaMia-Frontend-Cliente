import React from "react";
import "../../styles/themes/admin.css";
import SideBar from "../../components/Admin/SideBar/SideBar";
import NavBar from "../../components/Admin/NavBar/NavBar";

const AdminPage: React.FC = () => {
    return (
        <div className="admin-page">
            <NavBar />
            <div className="admin-layout">
                <SideBar />
                <main className="admin-content">
                    <h1>Welcome to the Admin Panel</h1>
                    <p>Manage your application here.</p>
                </main>
            </div>
        </div>
    );
};

export default AdminPage;