import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button className={`${styles.button} ${className || ''}`} onClick={onClick}>
      <div className={styles.buttonText}>{text}</div>
    </button>
  );
};

export default Button;
