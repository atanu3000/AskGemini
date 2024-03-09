import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
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

export const ThemeProvider: React.FC<{ children: ReactNode}> = ({ children }) => {
  const defaultTheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [theme, setTheme] = useState<string>(defaultTheme);
  const [mode, setMode] = useState<string>('default');
  
  useEffect(() => {
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
