import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/admin/NavBar/NavBar";
import Button from "../../../components/admin/Button/Button";
import styles from "./LoginAdmin.module.css";
import eyeOpen from "../../../assets/admin/eye-open.svg";
import eyeClosed from "../../../assets/admin/eye-closed.svg";
import googleLogo from "../../../assets/admin/google-logo.svg";
import "../../../styles/themes/admin.css";

const LoginAdmin: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Usuario de prueba
        if (email === "admin@admin.com" && password === "admin123") {
            const user = {
                usuario: "admin",
                rol: "admin"
            };
            localStorage.setItem("user", JSON.stringify(user));
            setError("");
            navigate("/admin/");
        } else {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className={styles.loginBg}>
            <NavBar />
            <div className={styles.centerContainer}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>Dirección de correo electrónico</label>
                    <input
                        className={styles.input}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                    />
                    <label className={styles.label}>Contraseña</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                        />
                        <img
                            src={showPassword ? eyeOpen : eyeClosed}
                            alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            className={styles.eyeIcon}
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={0}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    {error && <div style={{ color: "#D64C4C", fontSize: 14, marginBottom: 8 }}>{error}</div>}
                    <button
                        type="button"
                        className={styles.forgotPassword}
                        tabIndex={0}
                    >
                        ¿Haz olvidado tu contraseña?
                    </button>
                    <Button
                        label="Iniciar sesión"
                        type="submit"
                        className={styles.loginButton}
                        fullWidth
                    />
                    <div className={styles.orText}>O inicia sesión usando</div>
                    <Button
                        label={
                            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img src={googleLogo} alt="Google" style={{ width: 22, height: 22, marginRight: 8 }} />
                                Conectar con Google
                            </span>
                        }
                        type="button"
                        className={styles.googleButton}
                        fullWidth
                    />
                </form>
            </div>
        </div>
    );
};

export default LoginAdmin;