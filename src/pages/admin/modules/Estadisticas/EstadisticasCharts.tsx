import { ForwardedRef, forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import styles from "./EstadisticasSection.module.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const balanceData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
        {
            label: 'Ingresos',
            data: [12000, 15000, 8000, 10000, 16000, 20000, 22000],
            backgroundColor: '#5ACD40',
        },
        {
            label: 'Gastos',
            data: [8000, 9000, 7500, 9200, 10000, 12000, 13000],
            backgroundColor: '#D64C4C',
        },
    ],
};

export const balanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { enabled: true },
    },
    scales: {
        x: {
            grid: { display: false, drawBorder: false },
            ticks: { color: '#888', font: { size: 12 } },
        },
        y: {
            grid: { display: false, drawBorder: false },
            ticks: { color: '#888', font: { size: 12 }, stepSize: 5000 },
            beginAtZero: true,
        },
    },
    elements: {
        bar: { borderRadius: 6, borderSkipped: false },
    },
};

export const topProductos = [
    { id: 1, nombre: 'Pizza Rústica', popularidad: 85, ventas: 45 },
    { id: 2, nombre: 'Pizza Napolitana', popularidad: 78, ventas: 40 },
    { id: 3, nombre: 'Pizza 4 Quesos', popularidad: 92, ventas: 52 },
    { id: 4, nombre: 'Pizza Margarita', popularidad: 70, ventas: 35 },
    { id: 5, nombre: 'Pizza Vegetariana', popularidad: 65, ventas: 30 },
];

export const topClientes = [
    { id: 1, nombre: 'Lucas Chavez', compras: 20 },
    { id: 2, nombre: 'Franco Castillo', compras: 25 },
    { id: 3, nombre: 'Mariana Rodríguez', compras: 18 },
    { id: 4, nombre: 'Gabriel Torres', compras: 22 },
    { id: 5, nombre: 'Valentina López', compras: 15 },
];

export const getPopularityColor = (popularity: number): string => {
    if (popularity >= 80) return '#5ACD40';
    if (popularity >= 60) return '#FAAE42';
    return '#D64C4C';
};

export const EstadisticasCharts = forwardRef(
    (
        {
            balanceRef,
            topProductosRef,
            topClientesRef,
        }: {
            balanceRef: ForwardedRef<HTMLDivElement>;
            topProductosRef: ForwardedRef<HTMLDivElement>;
            topClientesRef: ForwardedRef<HTMLDivElement>;
        },
        _ // props
    ) => (
        <>
            {/* Sección de Balance */}
            <div className={styles.balanceContainer}>
                <div className={styles.sectionContainer} ref={balanceRef}>
                    <h2 className={styles.sectionTitle}>Balance Semanal</h2>
                    <div className={styles.chartContainer}>
                        <Bar data={balanceData} options={balanceOptions} />
                    </div>
                </div>
            </div>

            {/* Contenedor para las dos tablas inferiores */}
            <div className={styles.bottomTablesContainer}>
                {/* Top Productos */}
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
                                                    style={{
                                                        width: `${producto.popularidad}%`,
                                                        backgroundColor: getPopularityColor(producto.popularidad),
                                                    }}
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
                {/* Top Clientes */}
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
        </>
    )
);