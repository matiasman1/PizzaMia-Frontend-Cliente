import React from "react";
import Button from "../../../../../components/admin/Button/Button";
import lupaIcon from "../../../../../assets/admin/icon-lupa.svg";
import styles from "../InsumosSection.module.css";
import shared from "../../styles/Common.module.css";

interface SearchHeaderProps {
    onNewClick: () => void;
    title: string;
    search: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
    onNewClick,
    title,
    search,
    onSearchChange,
    placeholder = "Buscar"
}) => {
    return (
        <div className={styles.adminContentTop}>
            <Button
                label="Nuevo +"
                onClick={onNewClick}
                className={shared.nuevoButton}
            />
            <p className={styles.tituloCentrado}>{title}</p>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    className={styles.inputSearch}
                />
                <img src={lupaIcon} alt="Buscar" className={styles.lupaIcon} />
            </div>
        </div>
    );
};

export default SearchHeader;