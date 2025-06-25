import React, { useState, useEffect } from 'react';
import styles from './DateRangeModal.module.css';

interface DateRangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (start: Date | null, end: Date | null) => void;
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
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectingStart, setSelectingStart] = useState(true);

    useEffect(() => {
        setStartDate(initialStart);
        setEndDate(initialEnd);
    }, [initialStart, initialEnd, isOpen]);

    if (!isOpen) return null;

    // Generar días del mes
    const generateCalendarDays = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days = [];

        // Días del mes anterior
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const prevDay = new Date(year, month, -i);
            days.push({ date: prevDay, isCurrentMonth: false });
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ date: new Date(year, month, day), isCurrentMonth: true });
        }

        // Días del mes siguiente
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
        }

        return days;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isSameDay = (date1: Date | null, date2: Date | null) => {
        if (!date1 || !date2) return false;
        return date1.toDateString() === date2.toDateString();
    };

    const isInRange = (date: Date) => {
        if (!startDate || !endDate) return false;
        return date >= startDate && date <= endDate;
    };

    const handleDateClick = (date: Date) => {
        if (selectingStart) {
            setStartDate(date);
            setEndDate(null);
            setSelectingStart(false);
        } else {
            if (startDate && date < startDate) {
                setStartDate(date);
                setEndDate(startDate);
            } else {
                setEndDate(date);
            }
            setSelectingStart(true);
        }
    };

    const handleApply = () => {
        onApply(startDate, endDate);
    };

    const handleCancel = () => {
        setStartDate(initialStart);
        setEndDate(initialEnd);
        onClose();
    };

    const changeMonth = (delta: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
    };

    const calendarDays = generateCalendarDays(currentMonth);
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Seleccionar período</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                <div className={styles.dateInfo}>
                    <div className={styles.dateDisplay}>
                        <div className={styles.dateLabel}>Fecha inicio:</div>
                        <div className={styles.dateValue}>
                            {startDate ? formatDate(startDate) : 'Seleccionar fecha'}
                        </div>
                    </div>
                    <div className={styles.dateDisplay}>
                        <div className={styles.dateLabel}>Fecha fin:</div>
                        <div className={styles.dateValue}>
                            {endDate ? formatDate(endDate) : 'Seleccionar fecha'}
                        </div>
                    </div>
                </div>

                <div className={styles.calendar}>
                    <div className={styles.calendarHeader}>
                        <button onClick={() => changeMonth(-1)} className={styles.navButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                            </svg>
                        </button>
                        <div className={styles.monthYear}>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </div>
                        <button onClick={() => changeMonth(1)} className={styles.navButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                            </svg>
                        </button>
                    </div>

                    <div className={styles.calendarGrid}>
                        <div className={styles.weekDays}>
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                <div key={day} className={styles.weekDay}>{day}</div>
                            ))}
                        </div>
                        <div className={styles.daysGrid}>
                            {calendarDays.map((day, index) => {
                                const isToday = isSameDay(day.date, new Date());
                                const isStart = isSameDay(day.date, startDate);
                                const isEnd = isSameDay(day.date, endDate);
                                const inRange = isInRange(day.date);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                                        className={`${styles.dayButton} ${
                                            !day.isCurrentMonth ? styles.otherMonth : ''
                                        } ${isToday ? styles.today : ''} ${
                                            isStart ? styles.startDate : ''
                                        } ${isEnd ? styles.endDate : ''} ${
                                            inRange && !isStart && !isEnd ? styles.inRange : ''
                                        }`}
                                        disabled={!day.isCurrentMonth}
                                    >
                                        {day.date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleCancel} className={styles.cancelButton}>
                        Cancelar
                    </button>
                    <button 
                        onClick={handleApply} 
                        className={styles.applyButton}
                        disabled={!startDate || !endDate}
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateRangeModal;