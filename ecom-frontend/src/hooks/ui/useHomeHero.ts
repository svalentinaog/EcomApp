import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function useHomeHero() {
  const { t } = useTranslation("home");
  const { lang } = useParams();

  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  return {
    t,
    getPath,
  };
}
