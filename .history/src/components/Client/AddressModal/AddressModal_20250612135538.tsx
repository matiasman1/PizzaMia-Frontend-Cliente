import React, { useState, useEffect } from 'react';
import GoBackButton from '../GoBackButton';
import styles from './AddressModal.module.css';

// Importar los iconos específicos
import addressesLocation from '../../../assets/client/addresses-location.svg';
import addressesSearch from '../../../assets/client/addresses-search.svg';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (addressData: AddressFormData) => void;
    mode: 'add' | 'edit';
    initialData?: AddressFormData;
}

interface AddressFormData {
    ubicacion: string;
    departamento: string;
    calle: string;
    numero: string;
    piso: string;
}

const AddressModal: React.FC<AddressModalProps> = ({
    isOpen,
    onClose,
    onSave,
    mode,
    initialData
}) => {
    const [formData, setFormData] = useState<AddressFormData>({
        ubicacion: 'MENDOZA',
        departamento: '',
        calle: '',
        numero: '',
        piso: ''
    });

    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

    const departamentos = [
        'Capital',
        'Godoy Cruz',
        'Las Heras',
        'Luján de Cuyo',
        'Maipú',
        'San Martín',
        'Guaymallén',
        'Junín'
    ];

    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData(initialData);
        } else {
            setFormData({
                ubicacion: 'MENDOZA',
                departamento: '',
                calle: '',
                numero: '',
                piso: ''
            });
        }
    }, [initialData, mode, isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleInputChange = (field: keyof AddressFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDepartmentSelect = (departamento: string) => {
        setFormData(prev => ({
            ...prev,
            departamento
        }));
        setShowDepartmentDropdown(false);
    };

    const handleSave = () => {
        if (!formData.departamento || !formData.calle || !formData.numero) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        onSave(formData);
    };

    const isFormValid = formData.departamento && formData.calle && formData.numero;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.goBackContainer}>
                            <GoBackButton 
                                onClick={onClose}
                                variant="modal"
                                showBackText={false}
                            />
                        </div>
                        <h2 className={styles.title}>
                            {mode === 'add' ? 'Mis direcciones' : 'Editar dirección'}
                        </h2>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Ubicación */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>UBICACIÓN</label>
                        <div className={styles.locationField}>
                            <img 
                                src={addressesLocation} 
                                alt="Ubicación" 
                                className={styles.locationIcon} 
                            />
                            <input
                                type="text"
                                value={formData.ubicacion}
                                onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                                className={styles.locationInput}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Departamento */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>DEPARTAMENTO</label>
                        <div className={styles.dropdownContainer}>
                            <input
                                type="text"
                                value={formData.departamento}
                                placeholder="Ingrese el departamento"
                                onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                                onChange={(e) => handleInputChange('departamento', e.target.value)}
                                className={styles.dropdownInput}
                                readOnly
                            />
                            <img 
                                src={addressesSearch} 
                                alt="Buscar" 
                                className={styles.dropdownIcon} 
                            />
                            
                            {showDepartmentDropdown && (
                                <div className={styles.dropdownList}>
                                    {departamentos
                                        .filter(dep => 
                                            dep.toLowerCase().includes(formData.departamento.toLowerCase())
                                        )
                                        .map((departamento, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.dropdownItem} ${
                                                departamento === 'Godoy Cruz' ? styles.selectedItem : ''
                                            }`}
                                            onClick={() => handleDepartmentSelect(departamento)}
                                        >
                                            {departamento === 'Godoy Cruz' && <span className={styles.checkIcon}>✓</span>}
                                            {departamento}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fila de Calle y Número */}
                    <div className={styles.rowGroup}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>CALLE</label>
                            <input
                                type="text"
                                value={formData.calle}
                                placeholder="Av. San Martín 1450"
                                onChange={(e) => handleInputChange('calle', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>NÚMERO</label>
                            <input
                                type="text"
                                value={formData.numero}
                                placeholder="5150"
                                onChange={(e) => handleInputChange('numero', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* Piso/Depto */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>PISO / DEPTO (OPCIONAL)</label>
                        <input
                            type="text"
                            value={formData.piso}
                            placeholder="3B"
                            onChange={(e) => handleInputChange('piso', e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    {/* Botón Guardar */}
                    <button 
                        className={`${styles.saveButton} ${!isFormValid ? styles.disabled : ''}`}
                        onClick={handleSave}
                        disabled={!isFormValid}
                    >
                        {mode === 'add' ? 'GUARDAR DIRECCIÓN' : 'ACTUALIZAR DIRECCIÓN'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;