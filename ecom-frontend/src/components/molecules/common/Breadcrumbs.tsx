import { Link } from "react-router-dom";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

export default function Breadcrumbs() {
  const { t, lang, pathnames, buildLink, getLabel } = useBreadcrumbs();

  return (
    <nav className="breadcrumbs">
      <ul className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <Link to={`/${lang}`} className="breadcrumbs__link">
            {t("navigation.home")}
          </Link>
          {pathnames.length > 0 && <p className="breadcrumbs__separator">/</p>}
        </li>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = buildLink(index);
          const label = getLabel(value);

          return (
            <li key={to} className="breadcrumbs__item">
              {last ? (
                <p className="breadcrumbs__label--active">{label}</p>
              ) : (
                <>
                  <Link to={to} className="breadcrumbs__link">
                    {label}
                  </Link>
                  <p className="breadcrumbs__separator">/</p>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
