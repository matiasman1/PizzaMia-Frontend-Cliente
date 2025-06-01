import React, { useState } from 'react';
import ProfileLayout from "../../../../components/Client/ProfileLayout/ProfileLayout";
import styles from './Addresses.module.css';

interface Address {
  id: number;
  isPrimary: boolean;
  type: string;
  street: string;
  details: string;
}

const Addresses: React.FC = () => {
  // Estado para las direcciones
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      isPrimary: true,
      type: 'Dirección principal',
      street: 'Av. Colón 785,',
      details: 'Ciudad, Mendoza'
    },
    {
      id: 2,
      isPrimary: false,
      type: 'Dirección secundaria',
      street: 'Calle Boulogne Sur Mer 1320,',
      details: 'San Martín, Mendoza'
    },
    {
      id: 3,
      isPrimary: false,
      type: 'Dirección secundaria',
      street: 'Calle Belgrano 456,',
      details: 'Godoy Cruz, Mendoza'
    }
  ]);

  // Función para establecer una dirección como principal
  const setPrimaryAddress = (id: number) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isPrimary: address.id === id
    })));
  };

  // Función para eliminar una dirección
  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  // Función para modificar una dirección
  const modifyAddress = (id: number) => {
    alert(`Modificar dirección ID: ${id}`);
  };

  // Función para agregar una nueva dirección
  const addNewAddress = () => {
    alert('Agregar nueva ubicación');
  };

  // Renderizar el icono SVG según el estado de la dirección
  const renderLocationIcon = (isPrimary: boolean) => {
    if (isPrimary) {
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="21" fill="#F0F5FA"/>
          <path d="M21 26.5C24.5899 24.1667 28 19.9 28 15C28 10.0294 24.9706 7 21 7C17.0294 7 14 10.0294 14 15C14 19.9 17.41 24.1667 21 26.5Z" fill="#413DFB" stroke="#413DFB" strokeWidth="2"/>
          <circle cx="21" cy="15" r="3.5" fill="white" stroke="#413DFB" strokeWidth="2"/>
        </svg>
      );
    } else {
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="21" fill="#F0F5FA"/>
          <path d="M21 26.5C24.5899 24.1667 28 19.9 28 15C28 10.0294 24.9706 7 21 7C17.0294 7 14 10.0294 14 15C14 19.9 17.41 24.1667 21 26.5Z" fill="white" stroke="#CCCCCC" strokeWidth="2"/>
          <circle cx="21" cy="15" r="3.5" fill="white" stroke="#CCCCCC" strokeWidth="2"/>
        </svg>
      );
    }
  };

  return (
    <ProfileLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.sectionTitle}>Mis Direcciones</h2>
        </header>

        <div className={styles.addressesContainer}>
          {addresses.map((address) => (
            <div key={address.id} className={styles.addressCard}>
              <div className={styles.addressIconContainer}>
                {renderLocationIcon(address.isPrimary)}
              </div>

              <div className={styles.addressContent}>
                <div className={styles.addressTypeRow}>
                  <h3 className={styles.addressType}>{address.type}</h3>
                  <div className={styles.checkboxContainer}>
                    <input 
                      type="checkbox" 
                      id={`primary-${address.id}`} 
                      checked={address.isPrimary} 
                      onChange={() => setPrimaryAddress(address.id)}
                      className={styles.primaryCheckbox}
                    />
                    <label htmlFor={`primary-${address.id}`} className={styles.checkmarkLabel}>
                      <div className={styles.customCheckbox}>
                        {address.isPrimary && <span className={styles.checkmark}></span>}
                      </div>
                    </label>
                  </div>
                </div>
                
                <p className={styles.addressText}>
                  {address.street} <br />
                  {address.details}
                </p>

                <div className={styles.addressActions}>
                  <button 
                    className={styles.eliminateButton} 
                    onClick={() => deleteAddress(address.id)}
                  >
                    Eliminar
                  </button>
                  <button 
                    className={styles.modifyButton} 
                    onClick={() => modifyAddress(address.id)}
                  >
                    Modificar
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className={styles.addLocationButton} onClick={addNewAddress}>
            AGREGAR UBICACIÓN
          </button>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Addresses;