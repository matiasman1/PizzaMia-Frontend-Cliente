import React from "react";
import styles from "./Search.module.css";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ value, onChange }) => (
  <div className={styles.searchWrapper}>
    <FaSearch className={styles.searchIcon} />
    <input
      type="text"
      className={styles.searchBar}
      placeholder="¿Qué te gustaría comer?"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default Search;