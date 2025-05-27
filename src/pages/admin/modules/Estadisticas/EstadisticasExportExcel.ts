import ExcelJS from "exceljs";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { balanceData, topProductos, topClientes } from "./EstadisticasCharts";

export async function exportEstadisticasToExcel(
    balanceRef: HTMLDivElement | null,
    topProductosRef: HTMLDivElement | null,
    topClientesRef: HTMLDivElement | null
) {
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
        sheetBalance.addRow(['Día', 'Ingresos', 'Gastos', 'Balance Neto']);
        balanceData.labels.forEach((dia: string, i: number) => {
            sheetBalance.addRow([
                dia,
                balanceData.datasets[0].data[i],
                balanceData.datasets[1].data[i],
                balanceData.datasets[0].data[i] - balanceData.datasets[1].data[i]
            ]);
        });
        sheetBalance.addRow([
            'TOTAL',
            balanceData.datasets[0].data.reduce((a: number, b: number) => a + b, 0),
            balanceData.datasets[1].data.reduce((a: number, b: number) => a + b, 0),
            balanceData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) - balanceData.datasets[1].data.reduce((a: number, b: number) => a + b, 0)
        ]);
        sheetBalance.columns = [
            { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }
        ];
        sheetBalance.eachRow((row) => {
            row.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        const balanceImg = await getImageFromNode(balanceRef);
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
        const productosImg = await getImageFromNode(topProductosRef);
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
        const clientesImg = await getImageFromNode(topClientesRef);
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
}