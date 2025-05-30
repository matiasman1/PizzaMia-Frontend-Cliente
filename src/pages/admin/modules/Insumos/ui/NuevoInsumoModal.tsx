import React, { useState, useRef } from "react";
import { RubroApi } from "../../../../../types/typesAdmin";
import styles from "../InsumosSection.module.css";
import shared from "../../styles/Common.module.css";

interface NuevoInsumoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (insumoData: {
        denominacion: string;
        rubro: string;
        subRubro: string;
        unidadMedida: string;
    }, imageFile?: File) => Promise<void>;
    rubros: RubroApi[];
}

const UNIDADES = [
    { value: "GRAMOS", label: "Gramos" },
    { value: "MILILITROS", label: "Mililitros" },
    { value: "UNIDADES", label: "Unidades" },
];

export const NuevoInsumoModal: React.FC<NuevoInsumoModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    rubros,
}) => {
    const [nuevoInsumo, setNuevoInsumo] = useState({
        denominacion: "",
        rubro: "",
        subRubro: "",
        unidadMedida: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Rubros principales (sin padre)
    const rubrosPrincipales = rubros.filter(r => r.tipoRubro === "INSUMO" && r.rubroPadre == null);
    // Subrubros según rubro seleccionado
    const subRubros = rubros.filter(
        r => r.rubroPadre && r.rubroPadre.id === Number(nuevoInsumo.rubro)
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Crear preview de la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!nuevoInsumo.denominacion.trim()) {
            setError("El nombre del insumo es obligatorio");
            return;
        }
        if (!nuevoInsumo.rubro) {
            setError("Debe seleccionar un rubro");
            return;
        }
        if (!nuevoInsumo.unidadMedida) {
            setError("Debe seleccionar una unidad");
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(nuevoInsumo, selectedFile || undefined);
            setNuevoInsumo({ denominacion: "", rubro: "", subRubro: "", unidadMedida: "" });
            setSelectedFile(null);
            setPreviewUrl(null);
            setError("");
            onClose();
        } catch (err) {
            setError("Error al crear el insumo");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setNuevoInsumo({ denominacion: "", rubro: "", subRubro: "", unidadMedida: "" });
        setSelectedFile(null);
        setPreviewUrl(null);
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={shared.modalOverlay}>
            <div className={`${shared.modalContent} ${styles.modalContent}`}>
                <h2 className={styles.editarModalTitle}>Nuevo Insumo</h2>
                <div className={styles.editarModalGrid}>
                    {/* Columna 1: Datos */}
                    <div className={styles.editarModalCol}>
                        <input
                            className={`${shared.input} ${styles.input}`}
                            type="text"
                            placeholder="Nombre Insumo"
                            value={nuevoInsumo.denominacion}
                            onChange={e => setNuevoInsumo({ ...nuevoInsumo, denominacion: e.target.value })}
                            disabled={isLoading}
                        />
                        <select
                            className={`${shared.input} ${styles.input}`}
                            value={nuevoInsumo.rubro}
                            onChange={e => setNuevoInsumo({ ...nuevoInsumo, rubro: e.target.value, subRubro: "" })}
                            disabled={isLoading}
                        >
                            <option value="">Seleccione un rubro</option>
                            {rubrosPrincipales.map(r => (
                                <option key={r.id} value={r.id}>{r.denominacion}</option>
                            ))}
                        </select>
                        <select
                            className={`${shared.input} ${styles.input}`}
                            value={nuevoInsumo.subRubro}
                            onChange={e => setNuevoInsumo({ ...nuevoInsumo, subRubro: e.target.value })}
                            disabled={!nuevoInsumo.rubro || subRubros.length === 0 || isLoading}
                        >
                            <option value="">Seleccione un sub-rubro</option>
                            {subRubros.map(r => (
                                <option key={r.id} value={r.id}>{r.denominacion}</option>
                            ))}
                        </select>
                        <select
                            className={`${shared.input} ${styles.input}`}
                            value={nuevoInsumo.unidadMedida}
                            onChange={e => setNuevoInsumo({ ...nuevoInsumo, unidadMedida: e.target.value })}
                            disabled={isLoading}
                        >
                            <option value="">Seleccione una unidad</option>
                            {UNIDADES.map(u => (
                                <option key={u.value} value={u.value}>{u.label}</option>
                            ))}
                        </select>
                    </div>
                    {/* Columna 2: Imagen */}
                    <div className={styles.editarModalCol} style={{ alignItems: "center", justifyContent: "center" }}>
                        <div className={styles.imageUploadContainer}>
                            <div className={styles.imagePreviewArea}>
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Vista previa"
                                        className={styles.imagePreview}
                                    />
                                ) : (
                                    <div className={styles.noImagePlaceholder}>
                                        Sin imagen
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className={styles.selectImageButton}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                            >
                                Seleccionar Imagen
                            </button>
                        </div>
                    </div>
                </div>
                {error && <div className={shared.error}>{error}</div>}
                <div className={shared.modalActions}>
                    <button
                        className={shared.enviarButton}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creando..." : "Confirmar"}
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

export default NuevoInsumoModal;