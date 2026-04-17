import {useMemo} from 'react';
import translations from '../locales.json';

export const useTranslation = (language = 'vi') => {
  const t = useMemo(() => {
    return translations[language] || translations.vi;
  }, [language]);

  return {t};
};
