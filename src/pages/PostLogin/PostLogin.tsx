import { useAuth0 } from "@auth0/auth0-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { postLogin } from "../../api/clientApi";
import styles from "./PostLogin.module.css";
import { useAuthStore } from "../../store/authStore";
import { useShallow } from "zustand/shallow";
import { FaUser, FaEnvelope, FaIdCard, FaUserTag, FaPhone } from "react-icons/fa";

export const PostLogin = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Valores iniciales sacados de user o vacío si no existe
  const [formValues, setFormValues] = useState({
    email: user?.email || "",
    name: user?.given_name || "",
    nickName: user?.nickname || "",
    apellido: "",
    telefono: "", // Nuevo campo para teléfono
    connection: "google-oauth2",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const { setRol, setToken } = useAuthStore(
    useShallow((state) => ({
      setToken: state.setToken,
      setRol: state.setRol,
    }))
  );
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Primero obtener el token de Auth0
      const token = await getAccessTokenSilently({ cacheMode: "off" });

      // Luego usar el token para crear el usuario
      await postLogin(
        user?.sub!,
        formValues.email,
        formValues.name,
        formValues.apellido,
        token,
        formValues.telefono || formValues.nickName // Usar teléfono si está disponible, si no usar nickName
      );

      // Una vez creado el usuario, actualizar el estado
      setToken(token);
      setRol("Cliente");
      setSuccess(true);

      // Redirigir al menú
      navigate("/menu");
    } catch (err: any) {
      console.error("Error completo:", err);
      // Mostrar mensaje de error más detallado
      setError(
        err.response?.data ||
          "Error al crear el usuario. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.postLoginContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Completa tu perfil</h2>
        <p className={styles.formSubtitle}>Proporciona tus datos para finalizar el registro</p>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>¡Usuario creado con éxito!</div>}
        
        <form className={styles.registrationForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formValues.email}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaUser />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formValues.name}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaIdCard />
            </div>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formValues.apellido}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaPhone />
            </div>
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formValues.telefono}
              onChange={handleChange}
              required
              className={styles.formInput}
              pattern="[0-9]{10}"
              title="Debe contener 10 dígitos numéricos"
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaUserTag />
            </div>
            <input
              type="text"
              name="nickName"
              placeholder="Nombre de usuario"
              value={formValues.nickName}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Completar registro"}
          </button>
        </form>
      </div>
    </div>
  );
};
