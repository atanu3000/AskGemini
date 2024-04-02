import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { PropsWithChildren, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const defaultTheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [theme, setTheme] = useState<string>(defaultTheme);
  const [mode, setMode] = useState<string>('default');

  const fetchMode = async (): Promise<string | null> => {
    try {
      const themeMode = await AsyncStorage.getItem('askGemini_theme_mode');
      return themeMode;
    } catch (error) {
      console.error('Error fetching mode:', error);
      return null; 
    }
  }
  
  useEffect(() => {
    const getThemeMode = async () => {
      const theme = await fetchMode();
      theme && setMode(theme as string);
    }

    getThemeMode();

    if (mode === 'default') {
      setTheme(defaultTheme)      
    } else (
      setTheme(mode)
    )
  }, [mode, defaultTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode}}>
      {children}
    </ThemeContext.Provider>
  );
};
