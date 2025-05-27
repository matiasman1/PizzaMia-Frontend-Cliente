import React, { useRef } from 'react';
import styles from './EstadisticasSection.module.css';
import { EstadisticasCharts } from './EstadisticasCharts';
import { exportEstadisticasToExcel } from './EstadisticasExportExcel';

export const EstadisticasSection: React.FC = () => {
    const balanceRef = useRef<HTMLDivElement>(null);
    const topProductosRef = useRef<HTMLDivElement>(null);
    const topClientesRef = useRef<HTMLDivElement>(null);

    const handleExportToExcel = () => {
        exportEstadisticasToExcel(
            balanceRef.current,
            topProductosRef.current,
            topClientesRef.current
        );
    };

    return (
        <div className={styles.estadisticasSection} id="estadisticas-container">
            <EstadisticasCharts
                balanceRef={balanceRef}
                topProductosRef={topProductosRef}
                topClientesRef={topClientesRef}
            />
            <button
                className={styles.exportButton}
                onClick={handleExportToExcel}
            >
                <svg className={styles.exportIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm9-9v12c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h4v2H5v8h14V8h-3V6h4c.6 0 1 .4 1 1z"/>
                </svg>
                Exportar
            </button>
        </div>
    );
};