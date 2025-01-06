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
  const [isLoading, setIsLoading] = useState(false);
  const [disabledDates, setDisabledDates] = useState({});

  // Add this useEffect at the top level of your component
  useEffect(() => {
    return () => {
      setTimeSlots(generateTimeSlots());
      setDisabledDates({});
    };
  }, []);

  // Update the handleSave function
  const handleSave = async () => {
    if (!date || !time || !email) {
      alert("Please fill in all fields");
      return;
    }

    // Check if slot is already booked before proceeding
    const checkSlot = await isSlotBooked(date, { value: time });
    if (checkSlot) {
      alert(
        "This time slot is no longer available. Please select another time."
      );
      // Refresh the time slots
      const updatedSlots = await Promise.all(
        timeSlots.map(async (slot) => {
          const isBooked = await isSlotBooked(date, slot);
          return { ...slot, isBooked };
        })
      );
      setTimeSlots(updatedSlots);
      return;
    }

    setIsLoading(true);
    try {
      await onSave({ date, time, email, timeZone: userTimezone });
    } catch (error) {
      console.error("Error saving meeting:", error);
    } finally {
      setIsLoading(false);
    }
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
      const dateString = currentDate.toISOString().split("T")[0];
      const isDisabled = currentDate < today || disabledDates[dateString];
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

  const formatTimeWithZone = (time, targetTimezone) => {
    return new Date(time).toLocaleTimeString("en-US", {
      timeZone: targetTimezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    const istStart = 16; // 4 PM IST
    const istEnd = 25; // 1 AM next day

    for (let hour = istStart; hour < istEnd; hour++) {
      // Create date object for the slot time in IST
      const slotDate = new Date();
      slotDate.setHours(hour % 24, 0, 0, 0);

      // Convert IST time to user's local time
      const localTime = formatTimeWithZone(slotDate, userTimezone);
      const istTime = formatTimeWithZone(slotDate, "Asia/Kolkata");

      slots.push({
        istHour: hour,
        displayTime: localTime,
        value: `${String(hour % 24).padStart(2, "0")}:00`,
        istTime: istTime, // Store IST time for backend
      });
    }

    return slots;
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

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

  // Add this state at the top
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Add this single useEffect for all availability checks
  useEffect(() => {
    let isMounted = true;

    const checkSlotAvailability = async () => {
      if (!date || isLoadingSlots) return;
      setIsLoadingSlots(true);

      try {
        const updatedSlots = await Promise.all(
          timeSlots.map(async (slot) => {
            const isBooked = await isSlotBooked(date, slot);
            return { ...slot, isBooked };
          })
        );

        if (isMounted) {
          setTimeSlots(updatedSlots);

          // Update disabled dates for the selected date
          const dateString = date.toISOString().split("T")[0];
          setDisabledDates((prev) => ({
            ...prev,
            [dateString]: updatedSlots.every((slot) => slot.isBooked),
          }));
        }
      } catch (error) {
        console.error("Error checking slot availability:", error);
      } finally {
        if (isMounted) {
          setIsLoadingSlots(false);
        }
      }
    };

    const timer = setTimeout(checkSlotAvailability, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [date]); // Only check when date changes

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
        <label>
          Select Time (
          {new Intl.DateTimeFormat(undefined, {
            timeZoneName: "short",
          })
            .formatToParts()
            .find((part) => part.type === "timeZoneName")?.value ||
            userTimezone}
          )
        </label>
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

      <button
        onClick={handleSave}
        className={styles.scheduleButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className={styles.buttonSpinner}></div>
        ) : (
          "Schedule Meeting"
        )}
      </button>
    </div>
  );
};

export default MeetingScheduler;
