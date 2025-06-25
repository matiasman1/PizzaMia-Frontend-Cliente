import React, { useState } from 'react';
import { useClienteStore } from '../../../../store/clienteStore';
import styles from './DireccionSelector.module.css';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

interface DireccionSelectorProps {
  onClose: () => void;
}

const DireccionSelector: React.FC<DireccionSelectorProps> = ({ onClose }) => {
  const { cliente, domicilioSeleccionado, seleccionarDomicilio } = useClienteStore(state => ({
    cliente: state.cliente,
    domicilioSeleccionado: state.domicilioSeleccionado,
    seleccionarDomicilio: state.seleccionarDomicilio,
  }));

  const [selectedId, setSelectedId] = useState<number | null>(
    domicilioSeleccionado?.id || null
  );

  if (!cliente || !cliente.domicilios || cliente.domicilios.length === 0) {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
          <h2>Direcciones de entrega</h2>
          <p className={styles.emptyMessage}>No tienes direcciones registradas.</p>
          <button className={styles.cancelButton} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const handleSeleccion = () => {
    if (selectedId) {
      seleccionarDomicilio(selectedId);
      onClose();
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Selecciona tu dirección de entrega</h2>
        <div className={styles.direccionesList}>
          {cliente.domicilios.map(domicilio => (
            <div
              key={domicilio.id}
              className={`${styles.direccionItem} ${
                selectedId === domicilio.id ? styles.selected : ''
              }`}
              onClick={() => setSelectedId(domicilio.id)}
            >
              <FaMapMarkerAlt className={styles.markerIcon} />
              <div className={styles.direccionInfo}>
                <p className={styles.direccionCalle}>
                  {domicilio.calle} {domicilio.numero}
                </p>
                <p className={styles.direccionLocalidad}>
                  {domicilio.localidad.nombre} (CP: {domicilio.codigoPostal})
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleSeleccion}
            disabled={!selectedId}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DireccionSelector;