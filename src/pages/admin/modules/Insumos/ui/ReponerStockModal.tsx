import React, { useState, useEffect } from "react";
import { InsumoApi } from "../../../../../types/typesAdmin";
import styles from "../InsumosSection.module.css";
import shared from "../../styles/Common.module.css";

interface ReponerStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (insumo: InsumoApi, cantidad: number) => Promise<void>;
    insumo: InsumoApi | null;
}

export const ReponerStockModal: React.FC<ReponerStockModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    insumo,
}) => {
    const [cantidadReponer, setCantidadReponer] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (insumo) {
            setCantidadReponer("");
            setError("");
        }
    }, [insumo]);

    const handleSubmit = async () => {
        if (!cantidadReponer || isNaN(Number(cantidadReponer)) || Number(cantidadReponer) <= 0) {
            setError("Ingrese una cantidad válida");
            return;
        }
        
        if (!insumo) return;

        setIsLoading(true);
        try {
            await onSubmit(insumo, Number(cantidadReponer));
            setCantidadReponer("");
            setError("");
            onClose();
        } catch (err) {
            setError("Error al reponer stock");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setCantidadReponer("");
        setError("");
        onClose();
    };

    if (!isOpen || !insumo) return null;

    return (
        <div className={shared.modalOverlay}>
            <div className={`${shared.modalContent} ${styles.modalContent}`}>
                <h2>Reponer Stock</h2>
                <div style={{ marginBottom: 12 }}>
                    <strong>Nombre:</strong> {insumo.denominacion}
                </div>
                <div style={{ marginBottom: 12 }}>
                    <strong>Stock Actual:</strong> {insumo.stockActual || 0}
                </div>
                <input
                    className={`${shared.input} ${styles.input}`}
                    type="number"
                    placeholder="Cantidad a reponer"
                    value={cantidadReponer}
                    onChange={e => setCantidadReponer(e.target.value)}
                    min={1}
                    disabled={isLoading}
                />
                {error && <div className={shared.error}>{error}</div>}
                <div className={shared.modalActions}>
                    <button
                        className={shared.enviarButton}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Reponiendo..." : "Confirmar"}
                    </button>
                    <button
                        className={shared.salirButton}
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReponerStockModal;