// MeetingScheduler.js
import React, { useState } from "react";
import styles from "./MeetingScheduler.module.scss";

const MeetingScheduler = ({ onSave }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const handleSave = () => {
    if (!date || !time || !email) {
      alert("Please fill in all fields");
      return;
    }
    onSave({ date, time, email });
  };

  // Calendar helpers
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const isDisabled = currentDate < today;
      const isSelected =
        date &&
        date.getDate() === day &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear;

      days.push(
        <div
          key={day}
          className={`${styles.calendarDay} 
            ${isDisabled ? styles.disabled : ""} 
            ${isSelected ? styles.selected : ""}`}
          onClick={() =>
            !isDisabled && setDate(new Date(currentYear, currentMonth, day))
          }
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className={styles.MeetingScheduler}>
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Select Date</label>
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button onClick={prevMonth}>&lt;</button>
            <span>
              {months[currentMonth]} {currentYear}
            </span>
            <button onClick={nextMonth}>&gt;</button>
          </div>
          <div className={styles.calendarDays}>
            {days.map((day) => (
              <div key={day} className={styles.dayName}>
                {day}
              </div>
            ))}
          </div>
          <div className={styles.calendarGrid}>{renderCalendar()}</div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label>Select Time</label>
        <div className={styles.customSelect}>
          <div
            className={styles.selectTrigger}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
          >
            {time || "Select time slot"}
          </div>
          {isSelectOpen && (
            <div className={styles.selectContent}>
              {timeSlots.map((slot) => (
                <div
                  key={slot}
                  className={styles.selectItem}
                  onClick={() => {
                    setTime(slot);
                    setIsSelectOpen(false);
                  }}
                >
                  {slot}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleSave} className={styles.scheduleButton}>
        Schedule Meeting
      </button>
    </div>
  );
};

export default MeetingScheduler;
