import React, { useState } from "react";
import shared from "../../styles/Common.module.css";

interface GenericRubroModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (rubroData: { denominacion: string }) => Promise<void>;
    padre?: string;
    modalStyles: any;
}

const GenericRubroModal: React.FC<GenericRubroModalProps> = ({ 
    show, 
    onClose, 
    onSubmit, 
    padre,
    modalStyles 
}) => {
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!nombre.trim()) {
            setError("El nombre del rubro es obligatorio");
            return;
        }
        
        setLoading(true);
        try {
            await onSubmit({ denominacion: nombre });
            setNombre("");
            setError("");
        } catch (error) {
            setError("Error al crear el rubro");
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className={shared.modalOverlay}>
            <div className={`${shared.modalContent} ${modalStyles.modalContent}`}>
                <h2>
                    {padre ? `Nuevo sub-rubro de: ${padre}` : "Nuevo rubro padre"}
                </h2>
                <input
                    className={`${shared.input} ${modalStyles.input}`}
                    type="text"
                    placeholder="Ingrese el nombre del rubro"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
                {error && <div className={shared.error}>{error}</div>}
                <div className={shared.modalActions}>
                    <button
                        className={shared.enviarButton}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : "Confirmar"}
                    </button>
                    <button
                        className={shared.salirButton}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenericRubroModal;