import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function useBreadcrumbs() {
  const { lang } = useParams();
  const { t } = useTranslation("common");
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x !== lang);

  const buildLink = (index: number) =>
    `/${lang}/${pathnames.slice(0, index + 1).join("/")}`;

  const getLabel = (value: string) =>
    t(`navigation.${value}`, { defaultValue: value });

  return {
    t,
    lang,
    pathnames,
    buildLink,
    getLabel,
  };
}
