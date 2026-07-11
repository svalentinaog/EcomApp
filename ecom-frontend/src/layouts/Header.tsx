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
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { lang } = useParams();
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const initialSearch = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearch);
  const [menuOpen, setMenuOpen] = useState(false);

  // 1. Centralizamos los items de navegación (Se traducen solos vía 't')
  const navItems = useMemo(
    () => [
      { name: t("navigation.home"), path: "/", end: true },
      { name: t("navigation.shop"), path: "/shop", end: false },
      { name: t("navigation.contact"), path: "/contact", end: false },
    ],
    [t]
  );

  // 2. Helper para rutas localizadas
  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  // 3. Lógica de cambio de idioma simplificada
  const toggleLanguage = () => {
    const nextLang = lang === "es" ? "en" : "es";
    // Cambiamos el idioma en la librería e inmediatamente navegamos a la nueva URL
    i18n.changeLanguage(nextLang);
    navigate(location.pathname.replace(`/${lang}`, `/${nextLang}`));
  };

  // Helper para clases activas
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

  // Sync search state with URL params (only when URL changes, not on user typing)
  useEffect(() => {
    const urlSearch = searchParams.get("q") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  // Handle search change (update URL as user types)
  const handleSearchChange = (newValue: string) => {
    setSearch(newValue);
    const currentPath = location.pathname;
    if (newValue.trim()) {
      // If there's a search term, clear category filter
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("q", newValue.trim());
      // Update search params without full page reload if already on shop, else navigate
      if (currentPath.includes(`/${lang}/shop`)) {
        setSearchParams(newSearchParams);
      } else {
        navigate(`/${lang}/shop?q=${encodeURIComponent(newValue.trim())}`);
      }
    } else {
      // Clear search params if empty
      if (currentPath.includes(`/${lang}/shop`)) {
        setSearchParams({});
      } else {
        navigate(`/${lang}/shop`);
      }
    }
  };

  // Handle search submission (on Enter key) - optional, for consistency
  const handleSearchSubmit = () => {
    if (search.trim()) {
      // If not already on shop page, navigate there with query
      if (!location.pathname.includes(`/${lang}/shop`)) {
        navigate(`/${lang}/shop?q=${encodeURIComponent(search.trim())}`);
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
            <NavLink to={getPath("/login")} className={navLinkClass}>
              {t("header.access")}
            </NavLink>
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
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
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

        {/* Overlay for mobile menu */}
        {menuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
        )}
        {/* Menú móvil slide-out */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <h3>Menú</h3>
            <button
              className="close-menu-btn"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
        </div>
      </div>
    </header>
  );
}
