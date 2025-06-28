import { useAuth0 } from "@auth0/auth0-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { postLogin, actualizarCliente } from "../../api/clientApi";
import styles from "./PostLogin.module.css";
import { useAuthStore } from "../../store/authStore";
import { useShallow } from "zustand/shallow";
import { FaUser, FaEnvelope, FaIdCard, FaUserTag, FaPhone } from "react-icons/fa";
import { ClienteUpdateDTO } from "../../types/typesClient";

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
    telefono: "",
    connection: "google-oauth2",
  });

  // Función para manejar cambios en el teléfono (solo números)
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números
    const phoneValue = value.replace(/\D/g, '');
    
    setFormValues((prev) => ({
      ...prev,
      telefono: phoneValue,
    }));
  };

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

      console.log("🔑 Token obtenido, creando usuario...");
      
      // Crear el usuario en el backend
      const clienteCreado = await postLogin(
        user?.sub!,
        formValues.email,
        formValues.name,
        formValues.apellido,
        token,
        formValues.telefono
      );

      console.log("✅ Usuario creado:", clienteCreado);

      // Ahora actualizar el cliente con los datos correctos del formulario
      const datosActualizados: ClienteUpdateDTO = {
        nombre: formValues.name,
        apellido: formValues.apellido,
        telefono: parseInt(formValues.telefono),
        email: formValues.email,
        auth0Id: user?.sub!
      };

      console.log("🔄 Actualizando cliente con datos del formulario...");
      
      const clienteActualizado = await actualizarCliente(
        clienteCreado.id, 
        datosActualizados, 
        token
      );

      console.log("✅ Cliente actualizado:", clienteActualizado);

      // Una vez creado y actualizado el usuario, actualizar el estado
      setToken(token);
      setRol("Cliente");
      setSuccess(true);

      // Pequeña pausa para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate("/menu");
      }, 1500);

    } catch (err: any) {
      console.error("❌ Error completo:", err);
      
      // Mostrar mensaje de error más detallado
      let errorMessage = "Error al crear el usuario. Por favor, intenta nuevamente.";
      
      if (err.response?.data) {
        errorMessage = err.response.data;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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
        {success && (
          <div className={styles.successMessage}>
            ¡Usuario creado y actualizado con éxito! Redirigiendo...
          </div>
        )}
        
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
              disabled // Email no debería ser editable
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
              placeholder="Teléfono (ej: 152099463)"
              value={formValues.telefono}
              onChange={handlePhoneChange}
              required
              className={styles.formInput}
              minLength={8}
              maxLength={15}
              title="Debe contener entre 8 y 15 dígitos numéricos"
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
