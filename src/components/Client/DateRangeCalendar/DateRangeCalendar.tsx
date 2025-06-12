import React, { useState } from 'react';
import styles from './DateRangeCalendar.module.css';

interface DateRangeCalendarProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (startDate: Date, endDate: Date) => void;
}

const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({ isOpen, onClose, onAccept }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1; // Convertir domingo (0) a posición 6
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Días vacíos al inicio
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const handleDateClick = (day: number) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        if (!startDate || (startDate && endDate)) {
            // Primera selección o reiniciar selección
            setStartDate(selectedDate);
            setEndDate(null);
        } else if (startDate && !endDate) {
            // Segunda selección
            if (selectedDate < startDate) {
                setEndDate(startDate);
                setStartDate(selectedDate);
            } else {
                setEndDate(selectedDate);
            }
        }
    };

    const isDateInRange = (day: number) => {
        if (!startDate) return false;

        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        if (endDate) {
            return date >= startDate && date <= endDate;
        } else {
            return date.getTime() === startDate.getTime();
        }
    };

    const isStartDate = (day: number) => {
        if (!startDate) return false;
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return date.getTime() === startDate.getTime();
    };

    const isEndDate = (day: number) => {
        if (!endDate) return false;
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return date.getTime() === endDate.getTime();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleAccept = () => {
        if (startDate && endDate) {
            onAccept(startDate, endDate);
            onClose();
        }
    };

    const handleCancel = () => {
        setStartDate(null);
        setEndDate(null);
        onClose();
    };

    if (!isOpen) return null;

    const calendarDays = generateCalendarDays();

    return (
        <div className={styles.overlay}>
            <div className={styles.calendar}>
                <div className={styles.header}>
                    <button onClick={handlePrevMonth} className={styles.navButton}>‹</button>
                    <h3 className={styles.monthYear}>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button onClick={handleNextMonth} className={styles.navButton}>›</button>
                </div>

                <div className={styles.daysHeader}>
                    {dayNames.map(day => (
                        <div key={day} className={styles.dayName}>{day}</div>
                    ))}
                </div>

                <div className={styles.daysGrid}>
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`${styles.dayCell} ${day ? styles.activeDay : styles.emptyDay
                                } ${day && isDateInRange(day) ? styles.inRange : ''
                                } ${day && isStartDate(day) ? styles.startDate : ''
                                } ${day && isEndDate(day) ? styles.endDate : ''
                                }`}
                            onClick={() => day && handleDateClick(day)}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button onClick={handleCancel} className={styles.cancelButton}>
                        Cancelar
                    </button>
                    <button
                        onClick={handleAccept}
                        className={styles.acceptButton}
                        disabled={!startDate || !endDate}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateRangeCalendar;