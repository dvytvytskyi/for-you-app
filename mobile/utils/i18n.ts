import { I18n } from 'i18n-js';
import { useLanguageStore } from '@/store/languageStore';

// Import translations
import enCommon from '@/locales/en/common.json';
import enProfile from '@/locales/en/profile.json';
import enHome from '@/locales/en/home.json';
import enAuth from '@/locales/en/auth.json';
import enTabs from '@/locales/en/tabs.json';
import enProperties from '@/locales/en/properties.json';

import uaCommon from '@/locales/ua/common.json';
import uaProfile from '@/locales/ua/profile.json';
import uaHome from '@/locales/ua/home.json';
import uaAuth from '@/locales/ua/auth.json';
import uaTabs from '@/locales/ua/tabs.json';
import uaProperties from '@/locales/ua/properties.json';

import ruCommon from '@/locales/ru/common.json';
import ruProfile from '@/locales/ru/profile.json';
import ruHome from '@/locales/ru/home.json';
import ruAuth from '@/locales/ru/auth.json';
import ruTabs from '@/locales/ru/tabs.json';
import ruProperties from '@/locales/ru/properties.json';

// Create i18n instance
export const i18n = new I18n({
  en: {
    common: enCommon,
    profile: enProfile,
    home: enHome,
    auth: enAuth,
    tabs: enTabs,
    properties: enProperties,
  },
  ua: {
    common: uaCommon,
    profile: uaProfile,
    home: uaHome,
    auth: uaAuth,
    tabs: uaTabs,
    properties: uaProperties,
  },
  ru: {
    common: ruCommon,
    profile: ruProfile,
    home: ruHome,
    auth: ruAuth,
    tabs: ruTabs,
    properties: ruProperties,
  },
});

// Set default locale
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Translation function
export const t = (key: string, options?: object): string => {
  const currentLanguage = useLanguageStore.getState().language;
  i18n.locale = currentLanguage;
  return i18n.t(key, options);
};

// Hook for reactive translations
import { useEffect, useState } from 'react';

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const [, setUpdate] = useState(0);

  useEffect(() => {
    i18n.locale = language;
    setUpdate((prev) => prev + 1);
  }, [language]);

  return {
    t: (key: string, options?: object) => i18n.t(key, options),
    language,
  };
};

// Change language helper
export const changeLanguage = (language: 'en' | 'ua' | 'ru') => {
  useLanguageStore.getState().setLanguage(language);
  i18n.locale = language;
};

