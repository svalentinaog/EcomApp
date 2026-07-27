import { useState, useMemo, useEffect } from "react";
import {
  Link,
  NavLink,
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  shoppingCart,
  logoDark,
  phoneTop,
  userAccess,
  emailTop,
  langEN,
  langES,
  hamburger,
} from "@/assets";
import SearchBar from "@/components/molecules/common/SearchBar";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/useAuthStore";

export default function Header() {
  const { lang } = useParams();
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalItems } = useCart();
  
  const token = useAuthStore((state) => state.token);
  
  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  const initialSearch = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearch);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { name: t("navigation.home"), path: "/", end: true },
      { name: t("navigation.shop"), path: "/shop", end: false },
      { name: t("navigation.contact"), path: "/contact", end: false },
    ],
    [t]
  );

  const toggleLanguage = () => {
    const nextLang = lang === "es" ? "en" : "es";
    i18n.changeLanguage(nextLang);
    navigate(location.pathname.replace(`/${lang}`, `/${nextLang}`));
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

  // 1. Sincroniza la barra de búsqueda si la URL cambia por fuera (ej. usar botones del navegador)
  useEffect(() => {
    const urlSearch = searchParams.get("q") || "";
    if (search !== urlSearch) {
      setSearch(urlSearch);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 2. EFECTO DEBOUNCE: Ejecuta la búsqueda en vivo con un ligero retraso
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const trimmedSearch = search.trim();
      const shopPath = `/${lang}/shop`;
      const currentUrlSearch = searchParams.get("q") || "";

      // Evita actualizar la URL si el parámetro ya es el mismo
      if (trimmedSearch === currentUrlSearch) return;

      if (trimmedSearch) {
        if (location.pathname.includes(shopPath)) {
          // Si estamos en la tienda, actualizamos los parámetros (replace: true evita llenar el historial del navegador)
          setSearchParams({ q: trimmedSearch }, { replace: true });
        } else {
          // Si estamos en inicio u otra página, navegamos a la tienda
          navigate(`${shopPath}?q=${encodeURIComponent(trimmedSearch)}`);
        }
      } else if (location.pathname.includes(shopPath) && currentUrlSearch) {
        // Si borramos el texto y estamos en la tienda, limpiamos la URL
        setSearchParams({}, { replace: true });
      }
    }, 400); // Espera 400 milisegundos tras dejar de teclear

    return () => clearTimeout(delayDebounceFn);
  }, [search, lang, location.pathname, navigate, searchParams, setSearchParams]);

  // 3. El change ahora es limpio, solo modifica el input inmediatamente
  const handleSearchChange = (newValue: string) => {
    setSearch(newValue);
  };

  // 4. El submit se queda por si el usuario presiona "Enter" rápido y no quiere esperar los 400ms
  const handleSearchSubmit = () => {
    const trimmedSearch = search.trim();
    const shopPath = `/${lang}/shop`;
    if (trimmedSearch) {
      if (location.pathname.includes(shopPath)) {
        setSearchParams({ q: trimmedSearch }, { replace: true });
      } else {
        navigate(`${shopPath}?q=${encodeURIComponent(trimmedSearch)}`);
      }
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <div
              className="top-bar-item"
              onClick={toggleLanguage}
              style={{ cursor: "pointer" }}
            >
              <img src={lang === "es" ? langEN : langES} alt="Language" />
              <p>{lang === "es" ? "English" : "Español"}</p>
            </div>
            <div className="top-bar-item">
              <img src={phoneTop} alt="Phone" />
              <p>123-456-7890</p>
            </div>
            <div className="top-bar-item">
              <img src={emailTop} alt="Email" />
              <p>contact@example.com</p>
            </div>
          </div>

          <div className="top-bar-item">
            <img src={userAccess} alt="userAccess" />
            {token ? (
              <NavLink to={getPath("/profile")} className={navLinkClass}>
                Mi Perfil
              </NavLink>
            ) : (
              <NavLink to={getPath("/login")} className={navLinkClass}>
                {t("header.access") || "Acceso"}
              </NavLink>
            )}
          </div>
        </div>

        <hr />

        {/* Navbar */}
        <nav className="navbar">
          <Link to={getPath("/")}>
            <img src={logoDark} alt="LOGO" className="logo" />
          </Link>

          <div className="navbar-content">
            <div className="menu-items">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={getPath(item.path)}
                  end={item.end}
                  className={navLinkClass}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <SearchBar value={search} onChange={handleSearchChange} onSubmit={handleSearchSubmit} />

            <Link to={getPath("/cart")} className="cart-link">
              <img src={shoppingCart} alt="Cart" />
              {totalItems > 0 && (
                <span className="cart-count">{totalItems}</span>
              )}
            </Link>

            <img
              src={hamburger}
              alt="Menu"
              className="hamburger-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>
        </nav>

        {/* Overlay y Menú móvil */}
        {menuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
        )}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <h3>Menú</h3>
            <button
              className="close-menu-btn"
              onClick={() => setMenuOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <SearchBar value={search} onChange={handleSearchChange} onSubmit={handleSearchSubmit} />
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={getPath(item.path)}
              end={item.end}
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
          <NavLink
            to={getPath(token ? "/profile" : "/login")}
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            {token ? "Mi Perfil" : (t("header.access") || "Acceso")}
          </NavLink>
        </div>
      </div>
    </header>
  );
}