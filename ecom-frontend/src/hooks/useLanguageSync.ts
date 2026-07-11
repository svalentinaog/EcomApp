import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useLanguageSync = () => {
  const { lang } = useParams(); // Obtener el param de la URL ("es" o "en")
  const { i18n } = useTranslation();

  useEffect(() => {
    // Si existe un lang en la URL y es diferente al actual de i18n, actualízar.
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
};
