// Insumos.tsx
import React, { useState } from "react";
import RubrosTable from "./ui/RubrosTable";
import RubroModal from "./ui/RubroModal";
import EditRubroModal from "./ui/EditRubroModal";
import Button from "../../../../../components/admin/Button/Button";
import { useRubros } from "./hooks/useRubros";
import shared from "../../styles/Common.module.css";
import { RubroApi } from "../../../../../types/typesAdmin";

const Insumos: React.FC = () => {
    const {
        rubros,
        rubrosApi,
        loading,
        toggleEstado,
        handleCreateRubro,
        handleUpdateRubro
    } = useRubros();

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPadre, setCurrentPadre] = useState("");
    const [rubroToEdit, setRubroToEdit] = useState<RubroApi | null>(null);

    const handleNuevoRubro = (padre: string) => {
        setCurrentPadre(padre);
        setShowModal(true);
    };

    const handleEditRubro = (rowIndex: number) => {
        const rubro = rubrosApi.find(r => r.id === rubros[rowIndex].id);
        if (rubro) {
            setRubroToEdit(rubro);
            setShowEditModal(true);
        }
    };

    if (loading) {
        return <div className={shared.adminContent}>Cargando...</div>;
    }

    return (
        <div className={shared.adminContent}>
            <div className={shared.adminContentSection}>
                <p>Administrador de rubros</p>
                <Button
                    label="Nuevo +"
                    onClick={() => handleNuevoRubro("")}
                    className={shared.nuevoButton}
                />
                <RubrosTable
                    rubros={rubros}
                    rubrosApi={rubrosApi}
                    onToggleEstado={toggleEstado}
                    onAddSubrubro={handleNuevoRubro}
                    onEditRubro={handleEditRubro}
                />

                <RubroModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={async ({ denominacion }) => {
                        await handleCreateRubro({
                            denominacion,
                            tipoRubro: "INSUMO",
                            rubroPadre: currentPadre 
                                ? { id: rubros.find(r => r.rubro === currentPadre)?.id || "" }
                                : undefined
                        });
                        setShowModal(false);
                    }}
                    padre={currentPadre}
                />

                <EditRubroModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={async (rubroData) => {
                        if (rubroToEdit) {
                            await handleUpdateRubro(rubroToEdit.id, rubroData);
                            setShowEditModal(false);
                        }
                    }}
                    rubro={rubroToEdit}
                    rubrosApi={rubrosApi}
                />
            </div>
        </div>
    );
};

export default Insumos;