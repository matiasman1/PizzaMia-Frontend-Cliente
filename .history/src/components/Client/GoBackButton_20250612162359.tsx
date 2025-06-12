import React from 'react';
import styles from './GoBackButton.module.css';
import goBackIcon from '../../assets/client/goback-icon.svg';

interface GoBackButtonProps {
    text?: string;
    onClick: () => void;
    variant?: 'default' | 'modal'; // Variante para diferentes contextos
    showBackText?: boolean; // Nueva prop para controlar el texto "Perfil Usuario"
}

const GoBackButton: React.FC<GoBackButtonProps> = ({ 
    text, 
    onClick, 
    variant = 'default',
    showBackText = true // Por defecto muestra el texto
}) => {
    return (
        <div className={`${styles.container} ${variant === 'modal' ? styles.modalVariant : ''}`}>
            <button className={styles.backButton} onClick={onClick}>
                <img src={goBackIcon} alt="Volver" className={styles.backIcon} />
                {showBackText && "Perfil Usuario"}
            </button>
            {text && <h1 className={styles.title}>{text}</h1>}
        </div>
    );
};

export default GoBackButton;