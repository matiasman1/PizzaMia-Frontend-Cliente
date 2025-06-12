import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
    label: string | React.ReactNode;
    onClick?: () => void;
    selected?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    selected = false,
    fullWidth = false,
    disabled = false,
    type = "button",
    className = "",
}) => {
    const buttonClasses = [
        styles.button,
        selected ? styles.selected : "",
        fullWidth ? styles.fullWidth : "",
        className,
    ].filter(Boolean).join(" ");

    return (
        <button
        type={type}
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled}
        >
        <span className={styles.label}>{label}</span>
        </button>
    );
};

export default Button;