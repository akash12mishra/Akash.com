"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaSync } from "react-icons/fa";
import styles from "./GitHubContributionHeatmap.module.scss";

// Month name abbreviations
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Day of week labels (Sunday to Saturday)
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

// This is a simplified version that takes contribution data as a prop
const ContributionHeatmap = ({ contributionData, isLoading = false }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const tooltipRef = useRef(null);

  // Use intersection observer to animate on scroll
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Handle hover events for tooltips
  const handleCellMouseEnter = (day, event) => {
    setHoveredCell({
      day,
      rect: event.target.getBoundingClientRect(),
    });
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
  };

  // Position the tooltip based on the hovered cell
  useEffect(() => {
    if (hoveredCell && tooltipRef.current) {
      const tooltipElement = tooltipRef.current;
      const cellRect = hoveredCell.rect;
      
      // Position the tooltip above the cell
      tooltipElement.style.left = `${cellRect.left + (cellRect.width / 2)}px`;
      tooltipElement.style.top = `${cellRect.top - tooltipElement.offsetHeight - 5}px`;
      
      // Add class to show the tooltip
      tooltipElement.classList.add(styles.visible);
    }
  }, [hoveredCell]);

  // Format date for tooltip display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingPulse}></div>
      </div>
    );
  }

  // Return early if data isn't loaded yet
  if (!contributionData) {
    return null;
  }

  const { totalContributions, weeks } = contributionData;

  return (
    <div className={styles.heatmapWrapper}>
      <div className={styles.heatmapContainer}>
        {/* Day of week labels (left side) */}
        <div className={styles.dayLabels}>
          {DAY_LABELS.map((day, index) => (
            <div key={`day-${index}`} className={styles.dayLabel}>
              {day}
            </div>
          ))}
        </div>

        {/* Month labels (top) and Calendar grid */}
        <div className={styles.calendarContainer}>
          <div className={styles.monthLabels}>
            {weeks.map((week, weekIndex) => {
              const firstDay = new Date(week.firstDay);
              const month = firstDay.getMonth();
              
              // Only show label on first week of month
              const isFirstWeekOfMonth = 
                weekIndex === 0 || 
                new Date(weeks[weekIndex - 1].firstDay).getMonth() !== month;
              
              return isFirstWeekOfMonth ? (
                <div 
                  key={`month-${weekIndex}`} 
                  className={styles.monthLabel}
                  style={{ gridColumn: weekIndex + 1 }}
                >
                  {MONTH_LABELS[month]}
                </div>
              ) : null;
            })}
          </div>

          {/* Calendar grid with contribution cells */}
          <div className={styles.calendarGrid}>
            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className={styles.week}>
                {week.contributionDays.map((day) => {
                  // Get count level (0-4) for styling
                  let level = 0;
                  if (day.contributionCount > 0) {
                    if (day.contributionCount <= 3) level = 1;
                    else if (day.contributionCount <= 6) level = 2;
                    else if (day.contributionCount <= 9) level = 3;
                    else level = 4;
                  }

                  return (
                    <div
                      key={day.date}
                      className={`${styles.contributionCell} ${styles[`level${level}`]}`}
                      onMouseEnter={(e) => handleCellMouseEnter(day, e)}
                      onMouseLeave={handleCellMouseLeave}
                      data-date={day.date}
                      data-count={day.contributionCount}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Contribution level legend */}
      <div className={styles.legend}>
        <div className={styles.legendText}>Less</div>
        <div className={`${styles.legendCell} ${styles.level0}`}></div>
        <div className={`${styles.legendCell} ${styles.level1}`}></div>
        <div className={`${styles.legendCell} ${styles.level2}`}></div>
        <div className={`${styles.legendCell} ${styles.level3}`}></div>
        <div className={`${styles.legendCell} ${styles.level4}`}></div>
        <div className={styles.legendText}>More</div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div ref={tooltipRef} className={styles.tooltip}>
          <strong>
            {hoveredCell.day.contributionCount} contributions
          </strong>{" "}
          on {formatDate(hoveredCell.day.date)}
        </div>
      )}
    </div>
  );
};

export default ContributionHeatmap;
