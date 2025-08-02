"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme] = useState("dark");

  // Set dark theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Always use dark theme
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  // Dummy toggle function that does nothing (to maintain API compatibility)
  const toggleTheme = () => {
    // No-op - we always stay in dark mode
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
