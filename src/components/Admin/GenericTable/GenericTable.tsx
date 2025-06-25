import React from "react";
import styles from "./GenericTable.module.css";

type Column = {
    header: string;
    key: string;
    render?: (value: any, row: any, rowIndex: number) => React.ReactNode;
    className?: string;
};

interface GenericTableProps {
    columns: Column[];
    data: any[];
}

const GenericTable: React.FC<GenericTableProps> = ({ columns, data }) => (
    <div className={styles.tableContainer}>
        <table className={styles.rolesTable}>
            <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx} className={styles.tableHeader + " " + (col.className || "")}>
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col, colIndex) => (
                            <td key={colIndex} className={col.className || ""}>
                                {col.render
                                    ? col.render(row[col.key], row, rowIndex)
                                    : row[col.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default GenericTable;