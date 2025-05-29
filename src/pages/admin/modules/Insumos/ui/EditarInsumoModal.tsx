import React, { useState, useEffect, useRef } from "react";
import { InsumoApi, RubroApi } from "../../../../../types/typesAdmin";
import styles from "../InsumosSection.module.css";
import shared from "../../styles/Common.module.css";

interface EditarInsumoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: number, insumoData: any, imageFile?: File) => Promise<void>;
    insumo: InsumoApi | null;
    rubros: RubroApi[];
}

const UNIDADES = [
    { value: "GRAMOS", label: "Gramos" },
    { value: "MILILITROS", label: "Mililitros" },
    { value: "UNIDADES", label: "Unidades" },
];

export const EditarInsumoModal: React.FC<EditarInsumoModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    insumo,
    rubros,
}) => {
    const [editInsumo, setEditInsumo] = useState<any>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Rubros principales (sin padre)
    const rubrosPrincipales = rubros.filter(r => r.tipoRubro === "INSUMO" && r.rubroPadre == null);
    // Subrubros según rubro seleccionado
    const subRubrosEdit = rubros.filter(
        r => r.rubroPadre && r.rubroPadre.id === Number(editInsumo?.rubro)
    );

    useEffect(() => {
        if (insumo) {
            setEditInsumo({
                ...insumo,
                rubro: insumo.rubro?.id ? String(insumo.rubro.id) : "",
                subRubro: "",
                esParaElaborar: typeof insumo.esParaElaborar === "boolean" ? insumo.esParaElaborar : false,
            });
            
            // Si hay imagen, mostrarla en el preview
            if (insumo.imagen?.urlImagen) {
                setPreviewUrl(insumo.imagen.urlImagen);
            } else {
                setPreviewUrl(null);
            }
            
            setSelectedFile(null);
            setError("");
        }
    }, [insumo]);

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
        if (!editInsumo.denominacion.trim()) {
            setError("El nombre del insumo es obligatorio");
            return;
        }
        if (!editInsumo.rubro) {
            setError("Debe seleccionar un rubro");
            return;
        }
        if (!editInsumo.unidadMedida) {
            setError("Debe seleccionar una unidad");
            return;
        }
        if (editInsumo.precioCompra === "" || isNaN(Number(editInsumo.precioCompra))) {
            setError("Debe ingresar un precio de compra válido");
            return;
        }
        if (editInsumo.precioVenta === "" || isNaN(Number(editInsumo.precioVenta))) {
            setError("Debe ingresar un precio de venta válido");
            return;
        }

        // Construir el objeto para la API
        const body = {
            denominacion: editInsumo.denominacion,
            precioCompra: Number(editInsumo.precioCompra),
            precioVenta: Number(editInsumo.precioVenta),
            unidadMedida: editInsumo.unidadMedida,
            rubro: { id: editInsumo.subRubro || editInsumo.rubro },
            esParaElaborar: editInsumo.esParaElaborar,
            stockActual: editInsumo.stockActual,
            // Mantener la imagen existente solo si no se seleccionó una nueva
            // y si hay una imagen existente con ID
            imagen: !selectedFile && editInsumo.imagen?.id ? { 
                id: editInsumo.imagen.id,
                urlImagen: editInsumo.imagen.urlImagen 
            } : undefined
        };

        setIsLoading(true);
        try {
            await onSubmit(editInsumo.id, body, selectedFile || undefined);
            onClose();
        } catch (err) {
            setError("Error al editar el insumo");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        onClose();
    };

    if (!isOpen || !editInsumo) return null;

    return (
        <div className={shared.modalOverlay}>
            <div className={`${shared.modalContent} ${styles.modalContent}`} style={{ minWidth: 600, maxWidth: 700 }}>
                <h2 className={styles.editarModalTitle}>Editar Insumo</h2>
                <div className={styles.editarModalGrid}>
                    {/* Sección Izquierda */}
                    <div className={styles.editarModalCol}>
                        <input
                            className={`${shared.input} ${styles.input}`}
                            type="text"
                            placeholder="Nombre Insumo"
                            value={editInsumo.denominacion}
                            onChange={e => setEditInsumo({ ...editInsumo, denominacion: e.target.value })}
                            disabled={isLoading}
                        />
                        <input
                            className={`${shared.input} ${styles.input}`}
                            type="number"
                            placeholder="Precio Compra"
                            value={editInsumo.precioCompra === 0 ? "" : editInsumo.precioCompra}
                            onChange={e => setEditInsumo({ ...editInsumo, precioCompra: e.target.value })}
                            disabled={isLoading}
                        />
                        <input
                            className={`${shared.input} ${styles.input}`}
                            type="number"
                            placeholder="Precio Venta"
                            value={editInsumo.precioVenta === 0 ? "" : editInsumo.precioVenta}
                            onChange={e => setEditInsumo({ ...editInsumo, precioVenta: e.target.value })}
                            disabled={isLoading}
                        />
                        <select
                            className={`${shared.input} ${styles.input}`}
                            value={editInsumo.esParaElaborar ? "true" : "false"}
                            onChange={e => setEditInsumo({ ...editInsumo, esParaElaborar: e.target.value === "true" })}
                            disabled={isLoading}
                        >
                            <option value="true">¿Es para elaborar? Sí</option>
                            <option value="false">¿Es para elaborar? No</option>
                        </select>
                    </div>
                    {/* Sección Derecha */}
                    <div className={styles.editarModalCol}>
                        <select
                            className={`${shared.input} ${styles.input}`}
                            value={editInsumo.rubro}
                            onChange={e => setEditInsumo({ ...editInsumo, rubro: e.target.value, subRubro: "" })}
                            disabled={isLoading}
                        >
                            <option value="">Seleccione un rubro</option>
                            {rubrosPrincipales.map(r => (
                                <option key={r.id} value={r.id}>{r.denominacion}</option>
                            ))}
                        </select>
                        <select
                            className={`${shared.input} ${styles.input}`}
                            value={editInsumo.subRubro}
                            onChange={e => setEditInsumo({ ...editInsumo, subRubro: e.target.value })}
                            disabled={!editInsumo.rubro || subRubrosEdit.length === 0 || isLoading}
                        >
                            <option value="">Seleccione un sub-rubro</option>
                            {subRubrosEdit.map(r => (
                                <option key={r.id} value={r.id}>{r.denominacion}</option>
                            ))}
                        </select>
                        <select
                            className={`${shared.input} ${styles.input}`}
                            value={editInsumo.unidadMedida}
                            onChange={e => setEditInsumo({ ...editInsumo, unidadMedida: e.target.value })}
                            disabled={isLoading}
                        >
                            <option value="">Seleccione una unidad</option>
                            {UNIDADES.map(u => (
                                <option key={u.value} value={u.value}>{u.label}</option>
                            ))}
                        </select>
                        
                        {/* Selector de imágenes */}
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
                                Cambiar Imagen
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
                        {isLoading ? "Guardando..." : "Confirmar"}
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

export default EditarInsumoModal;