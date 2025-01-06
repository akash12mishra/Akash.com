// MeetingScheduler.js
import React, { useEffect, useState } from "react";
import styles from "./MeetingScheduler.module.scss";
import { format } from "date-fns";

const MeetingScheduler = ({ onSave }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [userTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

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

  const formatTime = (hours, minutes) => {
    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);
    return time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    // IST times: 4 PM to 1 AM
    const istStart = 16; // 4 PM
    const istEnd = 25; // 1 AM next day

    // Convert IST to local time
    const istOffset = 5.5; // IST is UTC+5:30
    const localOffset = new Date().getTimezoneOffset() / 60;
    const offsetDiff = istOffset + localOffset;

    for (let hour = istStart; hour < istEnd; hour++) {
      // Convert IST hour to local hour
      const localHour = (hour - offsetDiff + 24) % 24;

      const displayTime = formatTime(localHour, 0);
      const value = String(hour % 24).padStart(2, "0") + ":00"; // 24h format for backend

      slots.push({
        istHour: hour,
        displayTime,
        value,
        isBooked: false,
      });
    }

    return slots;
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  // Add this useEffect after the timeSlots state
  useEffect(() => {
    const checkSlotAvailability = async () => {
      if (!date) return;

      const updatedSlots = await Promise.all(
        timeSlots.map(async (slot) => {
          const isBooked = await isSlotBooked(date, slot);
          return { ...slot, isBooked };
        })
      );

      setTimeSlots(updatedSlots);
    };

    checkSlotAvailability();
  }, [date]);

  // Function to check if a slot is booked
  const isSlotBooked = async (date, timeSlot) => {
    try {
      const response = await fetch("/api/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time: timeSlot.value }),
      });
      const data = await response.json();
      return data.isBooked;
    } catch (error) {
      console.error("Error checking slot availability:", error);
      return false;
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
        <label>Select Time ({userTimezone})</label>
        <div className={styles.customSelect}>
          <div
            className={styles.selectTrigger}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
          >
            {time
              ? timeSlots.find((slot) => slot.value === time)?.displayTime
              : "Select time slot"}
          </div>
          {isSelectOpen && (
            <div className={styles.selectContent}>
              {timeSlots.map((slot) => (
                <div
                  key={slot.value}
                  className={`${styles.selectItem} ${
                    slot.isBooked ? styles.disabled : ""
                  }`}
                  onClick={() => {
                    if (!slot.isBooked) {
                      setTime(slot.value);
                      setIsSelectOpen(false);
                    }
                  }}
                >
                  {slot.displayTime}
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
