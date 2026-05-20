import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'fr');
  const [dir, setDir] = useState(lang === 'ar' ? 'rtl' : 'ltr');

  useEffect(() => {
    const handleLangChange = (lng) => {
      setLang(lng);
      const newDir = lng === 'ar' ? 'rtl' : 'ltr';
      setDir(newDir);
      document.documentElement.dir = newDir;
      document.documentElement.lang = lng;
      localStorage.setItem('lang', lng);
    };

    handleLangChange(lang);
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, [lang, i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
