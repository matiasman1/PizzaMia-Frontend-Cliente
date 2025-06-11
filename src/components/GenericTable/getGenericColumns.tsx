import chevronUp from "../../assets/admin/circle-chevron-up.svg";
import chevronDown from "../../assets/admin/circle-chevron-down.svg";
import iconEdit from "../../assets/admin/icon-edit.svg";
import styles from "./getGenericColumns.module.css";

export const getGenericColumns = ({
    onAlta,
    onBaja,
    onEditar,
    estadoKey = "estado",
    disabledAlta = () => false,
    disabledBaja = () => false,
}: {
    onAlta: (row: any, rowIndex: number) => void;
    onBaja: (row: any, rowIndex: number) => void;
    onEditar: (row: any, rowIndex: number) => void;
    estadoKey?: string;
    disabledAlta?: (row: any) => boolean;
    disabledBaja?: (row: any) => boolean;
}) => [
    {
        header: "Estado",
        key: estadoKey,
        render: (value: string) => (
            <span
                style={{
                    color: value === "Activo" ? "#5ACD40" : "#D64C4C",
                    fontWeight: 600,
                }}
            >
                {value}
            </span>
        ),
    },
    {
        header: "Alta",
        key: "alta",
        render: (_: any, row: any, rowIndex: number) => (
            <button
                className={styles.actionButton}
                onClick={() => onAlta(row, rowIndex)}
                disabled={disabledAlta(row)}
                type="button"
            >
                <img
                    src={chevronUp}
                    alt="Alta"
                    className={styles.actionIcon}
                    style={{ opacity: disabledAlta(row) ? 0.4 : 1 }}
                />
            </button>
        ),
    },
    {
        header: "Baja",
        key: "baja",
        render: (_: any, row: any, rowIndex: number) => (
            <button
                className={styles.actionButton}
                onClick={() => onBaja(row, rowIndex)}
                disabled={disabledBaja(row)}
                type="button"
            >
                <img
                    src={chevronDown}
                    alt="Baja"
                    className={styles.actionIcon}
                    style={{ opacity: disabledBaja(row) ? 0.4 : 1 }}
                />
            </button>
        ),
    },
    {
        header: "Editar",
        key: "editar",
        render: (_: any, row: any, rowIndex: number) => (
            <button
                className={styles.actionButton}
                onClick={() => onEditar(row, rowIndex)}
                type="button"
            >
                <img
                    src={iconEdit}
                    alt="Editar"
                    className={styles.actionIcon}
                />
            </button>
        ),
    },
];
