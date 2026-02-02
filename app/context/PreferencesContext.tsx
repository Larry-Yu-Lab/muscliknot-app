import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';
import { isSupportedLanguage } from '../utils/i18n';

type Language = 'en' | 'zh' | 'fr' | 'es';
type Theme = 'light' | 'dark';

interface PreferencesContextType {
    theme: Theme;
    language: Language;
    toggleTheme: () => void;
    setLanguage: (lang: Language) => void;
    isDarkMode: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = _useColorScheme();
    const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? 'dark' : 'light');
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem('app_theme');
            const storedLang = await AsyncStorage.getItem('app_language');

            if (storedTheme) setTheme(storedTheme as Theme);
            if (storedLang && isSupportedLanguage(storedLang)) {
                setLanguageState(storedLang as Language);
            } else {
                // Determine default language or fallback to 'en'
                setLanguageState('en');
            }
        } catch (error) {
            console.error('Failed to load preferences:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('app_theme', newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        try {
            await AsyncStorage.setItem('app_language', lang);
        } catch (error) {
            console.error('Failed to save language:', error);
        }
    };

    return (
        <PreferencesContext.Provider value={{ theme, language, toggleTheme, setLanguage, isDarkMode: theme === 'dark' }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
};
