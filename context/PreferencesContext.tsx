import { isSupportedLanguage } from '@/utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';

type Language = 'en' | 'zh' | 'fr' | 'es';
type Theme = 'light' | 'dark';

interface PreferencesContextType {
    theme: Theme;
    language: Language;
    notificationsEnabled: boolean;
    equipment: string[];
    toggleTheme: () => void;
    setLanguage: (lang: Language) => void;
    toggleNotifications: () => void;
    toggleEquipment: (id: string) => void;
    isDarkMode: boolean;
    refreshPreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = _useColorScheme();
    // Default to dark mode unless user has set a preference (handled in useEffect)
    const [theme, setTheme] = useState<Theme>('dark');
    const [language, setLanguageState] = useState<Language>('en');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [equipment, setEquipment] = useState<string[]>([]);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem('app_theme');
            const storedLang = await AsyncStorage.getItem('app_language');
            const storedNotifs = await AsyncStorage.getItem('app_notifications');
            const storedEquipment = await AsyncStorage.getItem('app_equipment');

            if (storedTheme) setTheme(storedTheme as Theme);
            if (storedLang && isSupportedLanguage(storedLang)) {
                setLanguageState(storedLang as Language);
            } else {
                setLanguageState('en');
            }
            if (storedNotifs !== null) {
                setNotificationsEnabled(storedNotifs === 'true');
            }
            if (storedEquipment) {
                setEquipment(JSON.parse(storedEquipment));
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

    const toggleNotifications = async () => {
        const newValue = !notificationsEnabled;
        setNotificationsEnabled(newValue);
        try {
            await AsyncStorage.setItem('app_notifications', String(newValue));
            if (newValue) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                if (existingStatus !== 'granted') {
                    await Notifications.requestPermissionsAsync();
                }
            }
        } catch (error) {
            console.error('Failed to save notifications preference:', error);
        }
    };

    const toggleEquipment = async (id: string) => {
        const newEquipment = equipment.includes(id)
            ? equipment.filter(e => e !== id)
            : [...equipment, id];

        setEquipment(newEquipment);
        try {
            await AsyncStorage.setItem('app_equipment', JSON.stringify(newEquipment));
        } catch (error) {
            console.error('Failed to save equipment preference:', error);
        }
    };

    return (
        <PreferencesContext.Provider value={{
            theme,
            language,
            notificationsEnabled,
            equipment,
            toggleTheme,
            setLanguage,
            toggleNotifications,
            toggleEquipment,
            isDarkMode: theme === 'dark',
            refreshPreferences: loadPreferences
        }}>
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
