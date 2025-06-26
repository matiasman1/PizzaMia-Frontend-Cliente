import React, { useState } from 'react';
import styles from './DateRangeModal.module.css';

interface DateRangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (startDate: Date | null, endDate: Date | null) => void;
    initialStart?: Date | null;
    initialEnd?: Date | null;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({
    isOpen,
    onClose,
    onApply,
    initialStart = null,
    initialEnd = null
}) => {
    const [startDate, setStartDate] = useState<Date | null>(initialStart);
    const [endDate, setEndDate] = useState<Date | null>(initialEnd);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    if (!isOpen) return null;

    const handleApply = () => {
        onApply(startDate, endDate);
        onClose();
    };

    const handleDateClick = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            // Empezar nueva selección
            setStartDate(date);
            setEndDate(null);
        } else if (date < startDate) {
            // Si la fecha es anterior al inicio, cambiar el inicio
            setStartDate(date);
            setEndDate(null);
        } else {
            // Establecer fecha final
            setEndDate(date);
        }
    };

    const isDateInRange = (date: Date): boolean => {
        if (!startDate || !endDate) return false;
        return date >= startDate && date <= endDate;
    };

    const isDateSelected = (date: Date): boolean => {
        return (startDate !== null && date.toDateString() === startDate.toDateString()) ||
            (endDate !== null && date.toDateString() === endDate.toDateString());
    };

    const formatDateRange = (): string => {
        if (!startDate && !endDate) return 'Selecciona un rango de fechas';
        if (startDate && !endDate) return `Desde: ${startDate.toLocaleDateString()}`;
        if (startDate && endDate) {
            return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        }
        return 'Selecciona un rango de fechas';
    };

    const getDaysInMonth = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentMonth(newMonth);
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Filtrar por Rango de Fechas</h3>
                    <p className={styles.subtitle}>Selecciona el período que deseas consultar</p>
                </div>

                <div className={styles.dateRange}>
                    <p className={styles.dateRangeText}>{formatDateRange()}</p>
                </div>

                <div className={styles.calendar}>
                    <div className={styles.calendarHeader}>
                        <button
                            className={styles.navButton}
                            onClick={() => navigateMonth('prev')}
                        >
                            ‹
                        </button>
                        <span className={styles.monthYear}>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button
                            className={styles.navButton}
                            onClick={() => navigateMonth('next')}
                        >
                            ›
                        </button>
                    </div>

                    <div className={styles.calendarGrid}>
                        <div className={styles.weekDays}>
                            {weekDays.map(day => (
                                <div key={day} className={styles.weekDay}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className={styles.daysGrid}>
                            {days.map((day, index) => {
                                const isOtherMonth = day.getMonth() !== currentMonth.getMonth();
                                const isToday = day.toDateString() === new Date().toDateString();
                                const isSelected = isDateSelected(day);
                                const isInRange = isDateInRange(day);

                                return (
                                    <button
                                        key={index}
                                        className={`${styles.dayButton} ${isOtherMonth ? styles.otherMonth : ''
                                            } ${isToday ? styles.today : ''} ${isSelected ? (day.toDateString() === startDate?.toDateString() ? styles.startDate : styles.endDate) : ''
                                            } ${isInRange && !isSelected ? styles.inRange : ''}`}
                                        onClick={() => !isOtherMonth && handleDateClick(day)}
                                        disabled={isOtherMonth}
                                    >
                                        {day.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className={styles.applyButton}
                        onClick={handleApply}
                        disabled={!startDate || !endDate}
                    >
                        Aplicar Filtro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateRangeModal;