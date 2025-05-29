import React, { useState, useEffect } from "react";
import { 
    ArticuloManufacturadoApi, 
    RubroApi, 
    InsumoApi 
} from "../../../../types/typesAdmin";
import { 
    fetchArticulosManufacturados, 
    patchEstadoArticuloManufacturado, 
    createArticuloManufacturado, 
    updateArticuloManufacturado, 
    fetchRubros,
    fetchInsumos
} from "../../../../api/apiAdmin";
import ProductosTable from "./ui/ProductosTable";
import SearchHeader from "../Insumos/ui/SearchHeader"; // Reutilizamos el componente
import NuevoProductoModal from "./ui/NuevoProductoModal";
import EditarProductoModal from "./ui/EditarProductoModal";
import VerRecetaModal from "./ui/VerRecetaModal"; // Nuevo componente
import styles from "./ProductosSection.module.css";
import shared from "../styles/Common.module.css";

export const ProductosSection: React.FC = () => {
    const [productos, setProductos] = useState<ArticuloManufacturadoApi[]>([]);
    const [rubros, setRubros] = useState<RubroApi[]>([]);
    const [insumos, setInsumos] = useState<InsumoApi[]>([]);
    const [search, setSearch] = useState("");
    
    // Estados para modales
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRecetaModal, setShowRecetaModal] = useState(false); // Nuevo estado
    
    // Estados para datos de modales
    const [productoToEdit, setProductoToEdit] = useState<ArticuloManufacturadoApi | null>(null);
    const [productoToShowRecipe, setProductoToShowRecipe] = useState<ArticuloManufacturadoApi | null>(null); // Nuevo estado

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productosData, rubrosData, insumosData] = await Promise.all([
                fetchArticulosManufacturados(),
                fetchRubros(),
                fetchInsumos()
            ]);
            setProductos(productosData);
            setRubros(rubrosData);
            setInsumos(insumosData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setProductos([]);
            setRubros([]);
            setInsumos([]);
        }
    };

    const handleToggleEstado = async (id: number) => {
        try {
            await patchEstadoArticuloManufacturado(id);
            await loadData(); // Recargar datos después del cambio
        } catch (error) {
            alert("Error al cambiar el estado del producto");
        }
    };

    const handleNuevoProducto = async (
        productoData: {
            denominacion: string;
            descripcion: string;
            tiempoEstimadoProduccion: number;
            rubro: string;
            detalles: any[];
        },
        imageFile?: File
    ) => {
        try {
            const body = {
                denominacion: productoData.denominacion,
                descripcion: productoData.descripcion,
                tiempoEstimadoProduccion: productoData.tiempoEstimadoProduccion,
                rubro: { id: productoData.rubro },
                detalles: productoData.detalles
            };
            
            await createArticuloManufacturado(body, imageFile);
            await loadData(); // Recargar datos después de crear
        } catch (error) {
            console.error("Error al crear producto:", error);
            alert("Error al crear el producto");
        }
    };

    const handleEditarProducto = async (id: number, productoData: any, imageFile?: File) => {
        try {
            await updateArticuloManufacturado(id, productoData, imageFile);
            await loadData(); // Recargar datos después de editar
        } catch (error) {
            console.error("Error al editar producto:", error);
            alert("Error al editar el producto");
        }
    };

    const handleEditClick = (producto: ArticuloManufacturadoApi) => {
        setProductoToEdit(producto);
        setShowEditModal(true);
    };

    const handleVerRecetaClick = (producto: ArticuloManufacturadoApi) => {
        setProductoToShowRecipe(producto);
        setShowRecetaModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setProductoToEdit(null);
    };

    const handleCloseRecetaModal = () => {
        setShowRecetaModal(false);
        setProductoToShowRecipe(null);
    };

    // Filtrar productos basado en la búsqueda
    const filteredProductos = productos.filter((item) =>
        item.denominacion.toLowerCase().includes(search.toLowerCase()) ||
        (item.rubro?.denominacion?.toLowerCase() || "").includes(search.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`${shared.adminContent} ${styles.adminContent}`}>
            <div className={shared.adminContentSection}>
                <SearchHeader
                    onNewClick={() => setShowNuevoModal(true)}
                    title="Administrador de productos"
                    search={search}
                    onSearchChange={setSearch}
                    placeholder="Buscar productos..."
                />

                <ProductosTable
                    productos={filteredProductos}
                    onToggleEstado={handleToggleEstado}
                    onEditProducto={handleEditClick}
                    onVerReceta={handleVerRecetaClick} // Nueva prop
                />

                {/* Modal Nuevo Producto */}
                <NuevoProductoModal
                    isOpen={showNuevoModal}
                    onClose={() => setShowNuevoModal(false)}
                    onSubmit={handleNuevoProducto}
                    rubros={rubros}
                    insumos={insumos}
                />

                {/* Modal Editar Producto */}
                <EditarProductoModal
                    isOpen={showEditModal}
                    onClose={handleCloseEditModal}
                    onSubmit={handleEditarProducto}
                    producto={productoToEdit}
                    rubros={rubros}
                    insumos={insumos}
                />

                {/* Modal Ver Receta */}
                <VerRecetaModal
                    isOpen={showRecetaModal}
                    onClose={handleCloseRecetaModal}
                    producto={productoToShowRecipe}
                />
            </div>
        </div>
    );
};

export default ProductosSection;