import React, { useState, useRef } from "react";
import { RubroApi, InsumoApi, ArticuloManufacturadoDetalleApi } from "../../../../../types/typesAdmin";
import styles from "../ProductosSection.module.css";
import shared from "../../styles/Common.module.css";

interface NuevoProductoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (productoData: {
        denominacion: string;
        descripcion: string;
        tiempoEstimadoProduccion: number;
        rubro: string;
        detalles: ArticuloManufacturadoDetalleApi[];
    }, imageFile?: File) => Promise<void>;
    rubros: RubroApi[];
    insumos: InsumoApi[];
}

export const NuevoProductoModal: React.FC<NuevoProductoModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    rubros,
    insumos
}) => {
    const [nuevoProducto, setNuevoProducto] = useState({
        denominacion: "",
        descripcion: "",
        tiempoEstimadoProduccion: "",
        rubro: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalleApi[]>([]);
    const [nuevoDetalle, setNuevoDetalle] = useState({
        insumoId: "",
        cantidad: ""
    });

    const calcularPrecioCosto = () => {
        return detalles.reduce((total, detalle) => {
            const precioInsumo = detalle.articuloInsumo.precioCompra || 0;
            return total + (precioInsumo * detalle.cantidad);
        }, 0);
    };
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Rubros principales (solo de tipo MANUFACTURADO)
    const rubrosPrincipales = rubros.filter(r => r.tipoRubro === "MANUFACTURADO");
    
    // Insumos filtrados (solo los que son para elaborar)
    const insumosParaElaborar = insumos.filter(i => i.esParaElaborar && i.estado === "Activo");

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

    const handleAddDetalle = () => {
        if (!nuevoDetalle.insumoId || !nuevoDetalle.cantidad || isNaN(Number(nuevoDetalle.cantidad)) || Number(nuevoDetalle.cantidad) <= 0) {
            setError("Debe seleccionar un insumo y una cantidad válida");
            return;
        }

        const insumoSeleccionado = insumos.find(i => i.id === Number(nuevoDetalle.insumoId));
        if (!insumoSeleccionado) {
            setError("Insumo no encontrado");
            return;
        }

        // Verificar si ya existe este insumo en los detalles
        const existe = detalles.some(d => d.articuloInsumo.id === Number(nuevoDetalle.insumoId));
        if (existe) {
            setError("Este insumo ya está en la lista");
            return;
        }

        const nuevoDetalleCompleto: ArticuloManufacturadoDetalleApi = {
            cantidad: Number(nuevoDetalle.cantidad),
            articuloInsumo: {
                id: Number(nuevoDetalle.insumoId),
                denominacion: insumoSeleccionado.denominacion,
                unidadMedida: insumoSeleccionado.unidadMedida,
                precioCompra: insumoSeleccionado.precioCompra // Agregamos el precio de compra aquí
            }
        };

        setDetalles([...detalles, nuevoDetalleCompleto]);
        setNuevoDetalle({ insumoId: "", cantidad: "" });
        setError("");
    };

    const handleRemoveDetalle = (index: number) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles.splice(index, 1);
        setDetalles(nuevosDetalles);
    };

    const handleSubmit = async () => {
        if (!nuevoProducto.denominacion.trim()) {
            setError("El nombre del producto es obligatorio");
            return;
        }
        if (!nuevoProducto.descripcion.trim()) {
            setError("La descripción es obligatoria");
            return;
        }
        if (!nuevoProducto.rubro) {
            setError("Debe seleccionar un rubro");
            return;
        }
        if (nuevoProducto.tiempoEstimadoProduccion === "" || 
            isNaN(Number(nuevoProducto.tiempoEstimadoProduccion)) || 
            Number(nuevoProducto.tiempoEstimadoProduccion) <= 0) {
            setError("Debe ingresar un tiempo de preparación válido");
            return;
        }
        if (detalles.length === 0) {
            setError("Debe agregar al menos un ingrediente");
            return;
        }
        if (!selectedFile) {
            setError("Debe seleccionar una imagen para el producto");
            return;
        }

        setIsLoading(true);
        try {
            const productoData = {
                denominacion: nuevoProducto.denominacion,
                descripcion: nuevoProducto.descripcion,
                tiempoEstimadoProduccion: Number(nuevoProducto.tiempoEstimadoProduccion),
                rubro: nuevoProducto.rubro,
                detalles: detalles.map(d => ({
                    cantidad: d.cantidad,
                    articuloInsumo: { id: d.articuloInsumo.id }
                }))
            };
            
            await onSubmit(productoData, selectedFile);
            
            // Reiniciar el formulario
            setNuevoProducto({
                denominacion: "",
                descripcion: "",
                tiempoEstimadoProduccion: "",
                rubro: "",
            });
            setDetalles([]);
            setSelectedFile(null);
            setPreviewUrl(null);
            setError("");
            onClose();
        } catch (err) {
            setError("Error al crear el producto");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setNuevoProducto({
            denominacion: "",
            descripcion: "",
            tiempoEstimadoProduccion: "",
            rubro: "",
        });
        setDetalles([]);
        setSelectedFile(null);
        setPreviewUrl(null);
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={shared.modalOverlay}>
            <div className={`${shared.modalContent} ${styles.modalContent}`} style={{ minWidth: 700, maxWidth: 900 }}>
                <h2>Nuevo Producto</h2>
                
                <div className={styles.nuevoProductoGrid}>
                    {/* Columna 1: Datos principales */}
                    <div className={styles.nuevoProductoCol}>
                        <input
                            className={`${shared.input} ${styles.input}`}
                            type="text"
                            placeholder="Nombre del producto"
                            value={nuevoProducto.denominacion}
                            onChange={e => setNuevoProducto({ ...nuevoProducto, denominacion: e.target.value })}
                            disabled={isLoading}
                        />
                        <textarea
                            className={`${shared.input} ${styles.textArea}`}
                            placeholder="Descripción del producto"
                            value={nuevoProducto.descripcion}
                            onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                            disabled={isLoading}
                            rows={3}
                        />
                        <input
                            className={`${shared.input} ${styles.input}`}
                            type="number"
                            placeholder="Tiempo de preparación (min)"
                            value={nuevoProducto.tiempoEstimadoProduccion}
                            onChange={e => setNuevoProducto({ ...nuevoProducto, tiempoEstimadoProduccion: e.target.value })}
                            disabled={isLoading}
                        />
                        <select
                            className={`${shared.input} ${styles.input}`}
                            value={nuevoProducto.rubro}
                            onChange={e => setNuevoProducto({ ...nuevoProducto, rubro: e.target.value })}
                            disabled={isLoading}
                        >
                            <option value="">Seleccione un rubro</option>
                            {rubrosPrincipales.map(r => (
                                <option key={r.id} value={r.id}>{r.denominacion}</option>
                            ))}
                        </select>
                    </div>
                    {/* Columna 2: Ingredientes */}
                    <div className={styles.nuevoProductoCol}>
                        <div className={styles.agregarIngredienteForm}>
                            <select
                                className={`${shared.input} ${styles.input}`}
                                value={nuevoDetalle.insumoId}
                                onChange={e => setNuevoDetalle({ ...nuevoDetalle, insumoId: e.target.value })}
                                disabled={isLoading}
                            >
                                <option value="">Seleccione un insumo</option>
                                {insumosParaElaborar.map(insumo => (
                                    <option key={insumo.id} value={insumo.id}>
                                        {insumo.denominacion} ({insumo.unidadMedida})
                                    </option>
                                ))}
                            </select>
                            <input
                                className={`${shared.input} ${styles.input}`}
                                type="number"
                                placeholder="Cantidad"
                                value={nuevoDetalle.cantidad}
                                onChange={e => setNuevoDetalle({ ...nuevoDetalle, cantidad: e.target.value })}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className={styles.addIngredienteButton}
                                onClick={handleAddDetalle}
                                disabled={isLoading}
                            >
                                Agregar
                            </button>
                            <h3 className={styles.ingredientesTitle}>Ingredientes</h3>
                            <div className={styles.ingredientesList}>
                                {detalles.length === 0 ? (
                                    <p className={styles.noIngredientes}>No hay ingredientes agregados</p>
                                ) : (
                                    detalles.map((detalle, index) => (
                                        <div key={index} className={styles.ingredienteItem}>
                                            <div className={styles.ingredienteInfo}>
                                                <span className={styles.ingredienteNombre}>
                                                    {detalle.articuloInsumo.denominacion}
                                                </span>
                                                <span className={styles.ingredienteCantidad}>
                                                    {detalle.cantidad} {detalle.articuloInsumo.unidadMedida?.toLowerCase()}
                                                </span>
                                            </div>
                                            <button 
                                                type="button"
                                                className={styles.removeIngredienteButton}
                                                onClick={() => handleRemoveDetalle(index)}
                                                disabled={isLoading}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className={styles.costoInfo}>
                                <p>Costo total de ingredientes: ${calcularPrecioCosto().toFixed(2)}</p>
                            </div>

                        </div>
                    </div>
                    {/* Columna 3: Imagen */}
                    <div className={styles.nuevoProductoCol} style={{ alignItems: "center", justifyContent: "center" }}>
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

export default NuevoProductoModal;