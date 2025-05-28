import React, { useState, useEffect } from "react";
import { InsumoApi, RegistroInsumoApi, RubroApi } from "../../../../types/typesAdmin";
import { fetchInsumos, patchEstadoInsumo, createInsumo, updateInsumo, fetchRubros, createRegistroInsumo } from "../../../../api/apiAdmin";
import InsumosTable from "./ui/InsumosTable";
import SearchHeader from "./ui/SearchHeader";
import NuevoInsumoModal from "./ui/NuevoInsumoModal";
import EditarInsumoModal from "./ui/EditarInsumoModal";
import ReponerStockModal from "./ui/ReponerStockModal";
import styles from "./InsumosSection.module.css";
import shared from "../styles/Common.module.css";

export const InsumosSection: React.FC = () => {
    const [insumos, setInsumos] = useState<InsumoApi[]>([]);
    const [rubros, setRubros] = useState<RubroApi[]>([]);
    const [search, setSearch] = useState("");
    
    // Estados para modales
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showReponerModal, setShowReponerModal] = useState(false);
    
    // Estados para datos de modales
    const [insumoToEdit, setInsumoToEdit] = useState<InsumoApi | null>(null);
    const [insumoToReponer, setInsumoToReponer] = useState<InsumoApi | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [insumosData, rubrosData] = await Promise.all([
                fetchInsumos(),
                fetchRubros()
            ]);
            setInsumos(insumosData);
            setRubros(rubrosData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setInsumos([]);
            setRubros([]);
        }
    };

    const handleToggleEstado = async (id: number) => {
        try {
            await patchEstadoInsumo(id);
            await loadData(); // Recargar datos después del cambio
        } catch (error) {
            alert("Error al cambiar el estado del insumo");
        }
    };

    const handleNuevoInsumo = async (insumoData: {
        denominacion: string;
        rubro: string;
        subRubro: string;
        unidadMedida: string;
    }) => {
        const body = {
            denominacion: insumoData.denominacion,
            unidadMedida: insumoData.unidadMedida,
            rubro: { id: insumoData.subRubro || insumoData.rubro },
            precioCompra: 0,
            precioVenta: 0,
            esParaElaborar: false,
        };

        await createInsumo(body);
        await loadData(); // Recargar datos después de crear
    };

    const handleEditarInsumo = async (id: number, insumoData: any) => {
        await updateInsumo(id, insumoData);
        await loadData(); // Recargar datos después de editar
    };

    const handleReponerStock = async (insumo: InsumoApi, cantidad: number, motivo: string) => {
    try {
        // Creamos el objeto RegistroInsumo
        const registroData: RegistroInsumoApi = {
            cantidad: cantidad,
            tipoMovimiento: "INGRESO", // Asumiendo que reponer es un ingreso
            motivo: motivo,
            articuloInsumo: { id: insumo.id },
            sucursal: { id: 1 }, // Deberías obtener la sucursal activa del usuario o del sistema
        };
        
        // Llamamos a la API para registrar el movimiento
        await createRegistroInsumo(registroData);
        
        // Refrescamos los insumos para obtener el stock actualizado
        await loadData();
        
    } catch (error) {
        console.error("Error al reponer stock:", error);
        alert("Error al actualizar el stock");
    }
};

    const handleEditClick = (insumo: InsumoApi) => {
        setInsumoToEdit(insumo);
        setShowEditModal(true);
    };

    const handleReponerClick = (insumo: InsumoApi) => {
        setInsumoToReponer(insumo);
        setShowReponerModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setInsumoToEdit(null);
    };

    const handleCloseReponerModal = () => {
        setShowReponerModal(false);
        setInsumoToReponer(null);
    };

    // Filtrar insumos basado en la búsqueda
    const filteredInsumos = insumos.filter((item) =>
        item.denominacion.toLowerCase().includes(search.toLowerCase()) ||
        (item.rubro?.denominacion?.toLowerCase() || "").includes(search.toLowerCase()) ||
        String(item.stockActual).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`${shared.adminContent} ${styles.adminContent}`}>
            <div className={shared.adminContentSection}>
                <SearchHeader
                    onNewClick={() => setShowNuevoModal(true)}
                    title="Administrador de insumos"
                    search={search}
                    onSearchChange={setSearch}
                    placeholder="Buscar insumos..."
                />

                <InsumosTable
                    insumos={filteredInsumos}
                    onToggleEstado={handleToggleEstado}
                    onEditInsumo={handleEditClick}
                    onReponerStock={handleReponerClick}
                />

                {/* Modal Nuevo Insumo */}
                <NuevoInsumoModal
                    isOpen={showNuevoModal}
                    onClose={() => setShowNuevoModal(false)}
                    onSubmit={handleNuevoInsumo}
                    rubros={rubros}
                />

                {/* Modal Editar Insumo */}
                <EditarInsumoModal
                    isOpen={showEditModal}
                    onClose={handleCloseEditModal}
                    onSubmit={handleEditarInsumo}
                    insumo={insumoToEdit}
                    rubros={rubros}
                />

                {/* Modal Reponer Stock */}
                <ReponerStockModal
                    isOpen={showReponerModal}
                    onClose={handleCloseReponerModal}
                    onSubmit={handleReponerStock}
                    insumo={insumoToReponer}
                />
            </div>
        </div>
    );
};

export default InsumosSection;