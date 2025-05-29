import React, { useState, useEffect } from "react";
import shared from "../../styles/Common.module.css";
import { RubroApi } from "../../../../../types/typesAdmin";

interface GenericEditRubroModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (rubroData: {
        denominacion: string;
        tipoRubro: string;
        rubroPadre?: { id: string | number } | null;
    }) => Promise<void>;
    rubro: RubroApi | null;
    rubrosApi: RubroApi[];
    tipoRubroDefault: "INSUMO" | "MANUFACTURADO";
    modalStyles: any;
}

const GenericEditRubroModal: React.FC<GenericEditRubroModalProps> = ({ 
    show, 
    onClose, 
    onSubmit, 
    rubro, 
    rubrosApi,
    tipoRubroDefault,
    modalStyles
}) => {
    const [editData, setEditData] = useState<{
        denominacion: string;
        tipoRubro: string;
        rubroPadre?: { id: string | number } | null;
    }>({ 
        denominacion: "", 
        tipoRubro: tipoRubroDefault,
        rubroPadre: null
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (rubro) {
            setEditData({
                denominacion: rubro.denominacion,
                tipoRubro: rubro.tipoRubro,
                rubroPadre: rubro.rubroPadre || null
            });
        }
    }, [rubro]);

    const handleSubmit = async () => {
        if (!editData.denominacion.trim()) {
            setError("El nombre del rubro es obligatorio");
            return;
        }
        
        setLoading(true);
        try {
            await onSubmit(editData);
            setError("");
        } catch (error) {
            setError("Error al editar el rubro");
        } finally {
            setLoading(false);
        }
    };

    if (!show || !rubro) return null;

    return (
        <div className={shared.modalOverlay}>
            <div className={`${shared.modalContent} ${modalStyles.modalContent}`}>
                <h2>Editar Rubro</h2>
                <input
                    className={`${shared.input} ${modalStyles.input}`}
                    type="text"
                    placeholder="Nombre del rubro"
                    value={editData.denominacion}
                    onChange={e => setEditData({...editData, denominacion: e.target.value})}
                />
                <select
                    className={`${shared.input} ${modalStyles.input}`}
                    value={editData.tipoRubro}
                    onChange={e => setEditData({...editData, tipoRubro: e.target.value})}
                >
                    <option value="INSUMO">INSUMO</option>
                    <option value="MANUFACTURADO">MANUFACTURADO</option>
                </select>
                <select
                    className={`${shared.input} ${modalStyles.input}`}
                    value={editData.rubroPadre?.id || ""}
                    onChange={e => {
                        const padre = rubrosApi.find(r => String(r.id) === e.target.value);
                        setEditData({
                            ...editData,
                            rubroPadre: padre ? { id: padre.id } : null
                        });
                    }}
                >
                    <option value="">Sin padre</option>
                    {rubrosApi
                        .filter(r => r.id !== rubro.id)
                        .map(r => (
                            <option key={r.id} value={r.id}>{r.denominacion}</option>
                        ))}
                </select>
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

export default GenericEditRubroModal;