import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [systemTheme, setSystemTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // Store in localStorage for persistence
    localStorage.setItem('theme-preference', theme);
  }, [theme, systemTheme]);

  // Load theme from localStorage on mount and try to sync with backend
  useEffect(() => {
    const loadInitialTheme = async () => {
      // First load from localStorage for immediate application
      const savedTheme = localStorage.getItem('theme-preference');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setTheme(savedTheme);
      }

      // Try to load from backend to sync with saved preferences
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/system/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const systemData = await response.json();
            if (systemData.theme_preference && ['light', 'dark', 'system'].includes(systemData.theme_preference)) {
              // Only update if different from localStorage to avoid conflicts
              if (systemData.theme_preference !== savedTheme) {
                setTheme(systemData.theme_preference);
                localStorage.setItem('theme-preference', systemData.theme_preference);
              }
            }
          }
        }
      } catch (error) {
        console.log('Could not load theme from backend:', error);
        // Fallback to localStorage value, which we already set above
      }

      setIsInitialized(true);
    };

    loadInitialTheme();
  }, []);

  // Method to sync theme from profile data
  const syncThemeFromProfile = (profileTheme) => {
    if (profileTheme && ['light', 'dark', 'system'].includes(profileTheme)) {
      // Only update if different from current theme to avoid loops
      if (profileTheme !== theme) {
        setTheme(profileTheme);
        // Also update localStorage to ensure persistence
        localStorage.setItem('theme-preference', profileTheme);
      }
    }
  };

  const updateTheme = (newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const getEffectiveTheme = () => {
    return theme === 'system' ? systemTheme : theme;
  };

  const value = {
    theme,
    systemTheme,
    effectiveTheme: getEffectiveTheme(),
    updateTheme,
    syncThemeFromProfile,
    isInitialized,
    isLight: getEffectiveTheme() === 'light',
    isDark: getEffectiveTheme() === 'dark',
    isSystem: theme === 'system'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;