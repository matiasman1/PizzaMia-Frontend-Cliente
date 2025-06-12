import React, { useRef } from 'react';
import styles from './EstadisticasSection.module.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';


// Registramos los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const EstadisticasSection: React.FC = () => {
    // Referencias para los componentes que queremos exportar
    const balanceRef = useRef<HTMLDivElement>(null);
    const topProductosRef = useRef<HTMLDivElement>(null);
    const topClientesRef = useRef<HTMLDivElement>(null);

    // Datos para el gráfico de Balance
    const balanceData = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
        {
            label: 'Ingresos',
            data: [12000, 15000, 8000, 10000, 16000, 20000, 22000],
            backgroundColor: '#5ACD40', // Color verde para ingresos
        },
        {
            label: 'Gastos',
            data: [8000, 9000, 7500, 9200, 10000, 12000, 13000],
            backgroundColor: '#D64C4C', // Color rojo para gastos
        },
        ],
    };

    const balanceOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Oculta la leyenda
            },
            title: {
                display: false, // Oculta el título
            },
            tooltip: {
                enabled: true, // Puedes dejarlo o ponerlo en false si quieres aún más minimalismo
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Sin líneas de cuadrícula verticales
                    drawBorder: false,
                },
                ticks: {
                    color: '#888', // Color suave
                    font: { size: 12 },
                },
            },
            y: {
                grid: {
                    display: false, // Sin líneas de cuadrícula horizontales
                    drawBorder: false,
                },
                ticks: {
                    color: '#888',
                    font: { size: 12 },
                    stepSize: 5000, // Ajusta según tus datos
                },
                beginAtZero: true,
            },
        },
        elements: {
            bar: {
                borderRadius: 6, // Bordes redondeados para un look más suave
                borderSkipped: false,
            },
        },
    };

    // Datos para Top Productos
    const topProductos = [
        { id: 1, nombre: 'Pizza Rústica', popularidad: 85, ventas: 45 },
        { id: 2, nombre: 'Pizza Napolitana', popularidad: 78, ventas: 40 },
        { id: 3, nombre: 'Pizza 4 Quesos', popularidad: 92, ventas: 52 },
        { id: 4, nombre: 'Pizza Margarita', popularidad: 70, ventas: 35 },
        { id: 5, nombre: 'Pizza Vegetariana', popularidad: 65, ventas: 30 },
    ];

    // Datos para Top Clientes
    const topClientes = [
        { id: 1, nombre: 'Lucas Chavez', compras: 20 },
        { id: 2, nombre: 'Franco Castillo', compras: 25 },
        { id: 3, nombre: 'Mariana Rodríguez', compras: 18 },
        { id: 4, nombre: 'Gabriel Torres', compras: 22 },
        { id: 5, nombre: 'Valentina López', compras: 15 },
    ];

    const handleExportToExcel = async () => {
        try {
            // Helper para capturar imagen de un nodo
            const getImageFromNode = async (node: HTMLDivElement | null) => {
                if (!node) return null;
                const canvas = await html2canvas(node, { backgroundColor: "#fff", scale: 2 });
                return {
                    imgData: canvas.toDataURL('image/png'),
                    width: canvas.width / 2,
                    height: canvas.height / 2
                };
            };

            // Crear el workbook de ExcelJS
            const workbook = new ExcelJS.Workbook();

            // 1. BALANCE SEMANAL
            const sheetBalance = workbook.addWorksheet('Balance Semanal');
            // Tabla
            sheetBalance.addRow(['Día', 'Ingresos', 'Gastos', 'Balance Neto']);
            balanceData.labels.forEach((dia, i) => {
                sheetBalance.addRow([
                    dia,
                    balanceData.datasets[0].data[i],
                    balanceData.datasets[1].data[i],
                    balanceData.datasets[0].data[i] - balanceData.datasets[1].data[i]
                ]);
            });
            sheetBalance.addRow([
                'TOTAL',
                balanceData.datasets[0].data.reduce((a, b) => a + b, 0),
                balanceData.datasets[1].data.reduce((a, b) => a + b, 0),
                balanceData.datasets[0].data.reduce((a, b) => a + b, 0) - balanceData.datasets[1].data.reduce((a, b) => a + b, 0)
            ]);
            sheetBalance.columns = [
                { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }
            ];
            sheetBalance.eachRow((row) => {
                row.alignment = { vertical: 'middle', horizontal: 'center' };
            });
            // Imagen
            const balanceImg = await getImageFromNode(balanceRef.current);
            if (balanceImg) {
                const imgId = workbook.addImage({
                    base64: balanceImg.imgData,
                    extension: 'png'
                });
                sheetBalance.addImage(imgId, {
                    tl: { col: 5, row: 1 },
                    ext: { width: balanceImg.width, height: balanceImg.height }
                });
            }

            // 2. TOP PRODUCTOS
            const sheetProductos = workbook.addWorksheet('Top Productos');
            sheetProductos.addRow(['#', 'Nombre', 'Popularidad', 'Ventas']);
            topProductos.forEach((p) => {
                sheetProductos.addRow([p.id, p.nombre, p.popularidad, p.ventas]);
            });
            sheetProductos.columns = [
                { width: 10 }, { width: 30 }, { width: 20 }, { width: 15 }
            ];
            sheetProductos.eachRow((row) => {
                row.alignment = { vertical: 'middle', horizontal: 'center' };
            });
            const productosImg = await getImageFromNode(topProductosRef.current);
            if (productosImg) {
                const imgId = workbook.addImage({
                    base64: productosImg.imgData,
                    extension: 'png'
                });
                sheetProductos.addImage(imgId, {
                    tl: { col: 5, row: 1 },
                    ext: { width: productosImg.width, height: productosImg.height }
                });
            }

            // 3. TOP CLIENTES
            const sheetClientes = workbook.addWorksheet('Top Clientes');
            sheetClientes.addRow(['#', 'Nombre', 'Compras']);
            topClientes.forEach((c) => {
                sheetClientes.addRow([c.id, c.nombre, c.compras]);
            });
            sheetClientes.columns = [
                { width: 10 }, { width: 30 }, { width: 15 }
            ];
            sheetClientes.eachRow((row) => {
                row.alignment = { vertical: 'middle', horizontal: 'center' };
            });
            const clientesImg = await getImageFromNode(topClientesRef.current);
            if (clientesImg) {
                const imgId = workbook.addImage({
                    base64: clientesImg.imgData,
                    extension: 'png'
                });
                sheetClientes.addImage(imgId, {
                    tl: { col: 5, row: 1 },
                    ext: { width: clientesImg.width, height: clientesImg.height }
                });
            }

            // Guardar el archivo ExcelJS
            const fecha = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `Estadisticas_Pizza_Mia_${fecha}.xlsx`);
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            alert('Ocurrió un error al exportar a Excel. Por favor intente nuevamente.');
        }
    };

    return (
        <div className={styles.estadisticasSection} id="estadisticas-container">        
            {/* Sección de Balance (parte superior) */}
            <div className={styles.balanceContainer}>
                <div className={styles.sectionContainer} ref={balanceRef}>
                    <h2 className={styles.sectionTitle}>Balance Semanal</h2>
                    <div className={styles.chartContainer}>
                        <Bar data={balanceData} options={balanceOptions} />
                    </div>
                </div>
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

            {/* Contenedor para las dos tablas inferiores */}
            <div className={styles.bottomTablesContainer}>
                {/* Sección de Top Productos (parte inferior izquierda) */}
                <div className={styles.sectionContainer} ref={topProductosRef}>
                    <h2 className={styles.sectionTitle}>Top Productos</h2>
                    <div className={styles.tableContainer}>
                        <table className={styles.customTable}>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Popularidad</th>
                                <th>Ventas</th>
                            </tr>
                            </thead>
                            <tbody>
                            {topProductos.map((producto) => (
                                <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>
                                    <div className={styles.popularityContainer}>
                                    <div 
                                        className={styles.popularityBar} 
                                        style={{ width: `${producto.popularidad}%`, backgroundColor: getPopularityColor(producto.popularidad) }}
                                    />
                                    <span className={styles.popularityText}>{producto.popularidad}%</span>
                                    </div>
                                </td>
                                <td>{producto.ventas}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Sección de Top Clientes (parte inferior derecha) */}
                <div className={styles.sectionContainer} ref={topClientesRef}>
                    <h2 className={styles.sectionTitle}>Top Clientes</h2>
                    <div className={styles.tableContainer}>
                        <table className={styles.customTable}>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Compras</th>
                            </tr>
                            </thead>
                            <tbody>
                            {topClientes.map((cliente) => (
                                <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.compras}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Función para determinar el color de la barra de popularidad según el valor
const getPopularityColor = (popularity: number): string => {
    if (popularity >= 80) return '#5ACD40'; // Verde para alta popularidad
    if (popularity >= 60) return '#FAAE42'; // Amarillo para popularidad media
    return '#D64C4C'; // Rojo para baja popularidad
};