import React from 'react';
import styles from './GoBackButton.module.css';

interface GoBackButtonProps {
    text?: string;
    onClick: () => void;
}

const GoBackButton: React.FC<GoBackButtonProps> = ({ text, onClick }) => {
    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={onClick}>
                <span className={styles.backIcon}>←</span>
                Perfil Usuario
            </button>
            {text && <h1 className={styles.title}>{text}</h1>}
        </div>
    );
};

export default GoBackButton;