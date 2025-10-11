"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useGithubContributions } from "../../../utils/useGithubContributions";
import { FaSync } from "react-icons/fa";
import styles from "./GitHubContributionHeatmap.module.scss";

// Month name abbreviations
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Day of week labels (Sunday to Saturday)
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

// Generate an array of years from current year back to 2020 (or adjust as needed)
const AVAILABLE_YEARS = Array.from(
  { length: new Date().getFullYear() - 2019 }, 
  (_, i) => new Date().getFullYear() - i
);

const GitHubContributionHeatmap = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { contributionData, loading, error, refetch, clearAllCaches } = useGithubContributions(selectedYear);
  
  // Add ref to track year changes
  const previousYearRef = useRef(selectedYear);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tooltipRef = useRef(null);
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Force clear all caches and fetch fresh data
    clearAllCaches();
    await refetch();
    setIsRefreshing(false);
  };
  
  // Single consolidated effect for data loading and year changes
  useEffect(() => {
    const handleDataRefresh = async () => {
      // Only run this effect when there's a meaningful change
      const isInitialLoad = !contributionData;
      const yearChanged = previousYearRef.current !== selectedYear;
      const hasDataYearMismatch = contributionData && 
                               contributionData._requestedYear && 
                               contributionData._requestedYear !== selectedYear;

      // Only refresh if needed
      if (isInitialLoad || yearChanged || hasDataYearMismatch) {
        // Set loading state
        if (!isRefreshing) {
          setIsRefreshing(true);
        }
        
        if (yearChanged) {
          console.log(`Year changed from ${previousYearRef.current} to ${selectedYear}`);   
          clearAllCaches();
          previousYearRef.current = selectedYear;
        }
        
        try {
          await refetch();
        } catch (err) {
          console.error('Error refreshing data:', err);
        } finally {
          setIsRefreshing(false);
        }
      }
    };
    
    handleDataRefresh();
    // Only include selectedYear to prevent loops with contributionData changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

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
      
      // Wait for next frame to get the correct tooltip dimensions
      requestAnimationFrame(() => {
        // Get tooltip dimensions after it's rendered
        const tooltipWidth = tooltipElement.offsetWidth;
        const tooltipHeight = tooltipElement.offsetHeight;
        
        // Calculate position, ensuring it stays on screen
        const left = Math.max(
          10, // Min 10px from left edge
          Math.min(
            cellRect.left + (cellRect.width / 2),
            window.innerWidth - tooltipWidth/2 - 10 // Prevent overflow on right
          )
        );
        
        // Position the tooltip above the cell
        tooltipElement.style.left = `${left}px`;
        tooltipElement.style.top = `${cellRect.top - tooltipHeight - 5}px`;
        
        // Add class to show the tooltip
        tooltipElement.classList.add(styles.visible);
      });
    }
  }, [hoveredCell]);

  // Format date for tooltip display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Render loading state
  if (loading) {
    return (
      <section className={styles.contributionsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>GitHub</span>
            <h2 className={styles.heading}>
              Contribution <span>Activity</span>
            </h2>
          </div>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingPulse}></div>
          </div>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className={styles.contributionsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>GitHub</span>
            <h2 className={styles.heading}>
              Contribution <span>Activity</span>
            </h2>
          </div>
          <div className={styles.errorContainer}>
            <p>Unable to load GitHub contribution data</p>
            <button 
              className={`${styles.refreshButton} ${isRefreshing ? styles.spinning : ''}`} 
              onClick={handleRefresh} 
              aria-label="Retry fetching GitHub contributions"
              disabled={isRefreshing}
            >
              <FaSync /> Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Return early if data isn't loaded yet
  if (!contributionData) {
    return null;
  }

  // Extract data before conditional check
  const { totalContributions, weeks = [] } = contributionData || {};

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className={styles.contributionsSection}
      id="github-contributions"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>GitHub</span>
          <h2 className={styles.heading}>
            Contribution <span>Activity</span>
          </h2>
          <p className={styles.subheading}>
            {totalContributions} contributions {selectedYear === new Date().getFullYear() ? 'in the last year' : `in ${selectedYear}`}
          </p>
          <div className={styles.yearSelector}>
            {AVAILABLE_YEARS.map(year => (
              <button 
                key={year}
                onClick={() => {
                  // Only act if year is different
                  if (selectedYear !== year) {
                    setSelectedYear(year);
                    // Force refresh when changing years
                    setIsRefreshing(true);
                    // Clear any cached data for this specific year
                    clearAllCaches();
                    // Trigger refetch with slight delay to ensure state updates
                    setTimeout(() => {
                      refetch().then(() => setIsRefreshing(false));
                    }, 200);
                  }
                }}
                className={`${styles.yearButton} ${selectedYear === year ? styles.active : ''}`}
              >
                {year}
              </button>
            ))}
          </div>
          <button 
            className={`${styles.refreshButton} ${isRefreshing ? styles.spinning : ''}`} 
            onClick={handleRefresh} 
            aria-label="Refresh GitHub contributions"
            disabled={isRefreshing}
          >
            <FaSync />
          </button>
        </div>

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

            {/* Month labels (top) */}
            <div className={styles.calendarContainer}>
              <div className={styles.monthLabels}>
                {/* Generate month labels from weeks data */}
                {(() => {
                  // Filter weeks using the same criteria as the calendar grid
                  // Filter weeks to ONLY include data from the selected year
                  const filteredWeeks = weeks.filter((week) => {
                    if (!selectedYear) return true;
                    
                    const weekDate = new Date(week.firstDay);
                    const weekYear = weekDate.getFullYear();
                    const weekMonth = weekDate.getMonth();
                    
                    // Filter out December from previous year
                    if (weekYear < selectedYear) {
                      return false;
                    }
                    
                    // Check days - only keep if at least one day is from the selected year
                    const hasSelectedYearDay = week.contributionDays.some(day => {
                      const dayDate = new Date(day.date);
                      return dayDate.getFullYear() === selectedYear;
                    });
                    
                    return hasSelectedYearDay;
                  });
                  
                  // Create an array to hold month labels with their positions
                  const monthLabels = [];
                  const totalWeeks = filteredWeeks.length;
                  const cellWidth = 14; // Cell width including margin
                  
                  // Calculate total width
                  const totalWidth = totalWeeks * cellWidth;
                  
                  // Map through filtered weeks to find the first week of each month
                  for (let i = 0; i < filteredWeeks.length; i++) {
                    const week = filteredWeeks[i];
                    const firstDay = new Date(week.firstDay);
                    const month = firstDay.getMonth();
                    const year = firstDay.getFullYear();
                    
                    // Skip months from wrong year
                    if (selectedYear && year !== selectedYear) {
                      continue;
                    }
                    
                    // Only show label on first week of month
                    const isFirstWeekOfMonth = 
                      (i === 0 && year === selectedYear) || 
                      (i > 0 && 
                        (new Date(filteredWeeks[i - 1].firstDay).getMonth() !== month ||
                         new Date(filteredWeeks[i - 1].firstDay).getFullYear() !== year));
                    
                    if (isFirstWeekOfMonth) {
                      monthLabels.push({
                        month,
                        position: i,
                        key: `month-${month}-${firstDay.getFullYear()}`
                      });
                    }
                  }
                  
                  // Render the month labels with correct positioning
                  return monthLabels.map(({ month, position, key }) => {
                    const leftPos = (position * cellWidth / totalWidth) * 100;
                    return (
                      <div 
                        key={key} 
                        className={styles.monthLabel}
                        style={{ left: `${leftPos}%` }}
                      >
                        {MONTH_LABELS[month]}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Calendar grid with contribution cells */}
              <div className={styles.calendarGrid}>
                {weeks.filter((week) => {
                  if (!selectedYear) return true;
                  
                  const weekDate = new Date(week.firstDay);
                  const weekYear = weekDate.getFullYear();
                  
                  // Filter out any weeks from previous years
                  if (weekYear < selectedYear) {
                    return false;
                  }
                  
                  // Check if any day in this week is from the selected year
                  const hasSelectedYearDay = week.contributionDays.some(day => {
                    const dayDate = new Date(day.date);
                    return dayDate.getFullYear() === selectedYear;
                  });
                  
                  return hasSelectedYearDay;
                }).map((week, weekIndex) => (
                  <div key={`week-${weekIndex}`} className={styles.week}>
                    {week.contributionDays.filter(day => {
                      // Only include days that match the selected year
                      if (selectedYear) {
                        const dayDate = new Date(day.date);
                        return dayDate.getFullYear() === selectedYear;
                      }
                      return true;
                    }).map((day) => {
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
        </div>
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
    </motion.section>
  );
};

export default GitHubContributionHeatmap;
