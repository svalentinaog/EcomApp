import { useMemo } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "@/layouts/Container";
import {
  logoLight,
  facebook,
  twitter,
  google,
  instagram,
  youtube,
  visa,
  mastercard,
  americanExpress,
  paypal,
  discover,
  email,
  phone,
  location,
} from "@/assets";

export default function Footer() {
  const { lang } = useParams();
  const { t } = useTranslation("common");

  // Helper para rutas localizadas
  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  // 1. Items del menú (Consistentes con el Header)
  const menuItems = useMemo(
    () => [
      { name: t("navigation.home"), path: "/", end: true },
      { name: t("navigation.shop"), path: "/shop", end: false },
      { name: t("navigation.contact"), path: "/contact", end: false },
      { name: t("navigation.access"), path: "/login", end: false },
    ],
    [t]
  );
  const menuItemsLegalDocs = useMemo(
    () => [
      {
        name: t("navigation.legalNotice"),
        path: "/legal/legal-notice",
        end: false,
      },
      {
        name: t("navigation.privacyPolicy"),
        path: "/legal/privacy-policy",
        end: false,
      },
      {
        name: t("navigation.shippingPolicy"),
        path: "/legal/shipping-and-returns-policy",
        end: false,
      },
    ],
    [t]
  );

  // 2. Redes Sociales
  const socialLinks = [
    { name: "Facebook", icon: facebook, url: "https://www.facebook.com/" },
    { name: "Twitter", icon: twitter, url: "https://twitter.com/" },
    { name: "Google", icon: google, url: "https://www.google.com/" },
    { name: "Youtube", icon: youtube, url: "https://www.youtube.com/" },
    { name: "Instagram", icon: instagram, url: "https://www.instagram.com/" },
  ];

  // 3. Métodos de Pago
  const paymentMethods = [
    { name: "visa", icon: visa },
    { name: "mastercard", icon: mastercard },
    { name: "american-express", icon: americanExpress },
    { name: "paypal", icon: paypal },
    { name: "discover", icon: discover },
  ];

  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <div className="footer-columns">
            {/* Columna 1: Logo y RRSS */}
            <div className="footer-column">
              <Link to={getPath("/")}>
                <img src={logoLight} alt="LOGO" className="footer-logo" />
              </Link>
              <p>{t("footer.description")}</p>
              <div className="footer-social">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={social.icon} alt={social.name} />
                  </a>
                ))}
              </div>
            </div>

            {/* Columna 2: Menú Dinámico */}
            <div className="footer-column">
              <h3>{t("footer.titles.menu")}</h3>
              <div className="footer-items">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={getPath(item.path)}
                    end={item.end}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Columna 3: Contacto */}
            <div className="footer-column">
              <h3>{t("footer.titles.contact")}</h3>
              <div className="footer-items">
                <div className="footer-item">
                  <img src={phone} alt="phone" />
                  <a href="tel:+573124567890">+57 312 456 7890</a>
                </div>
                <div className="footer-item">
                  <img src={email} alt="email" />
                  <a href="mailto:info@ecom.com">info@ecom.com</a>
                </div>
                <div className="footer-item">
                  <img src={location} alt="location" />
                  <a href="https://www.google.com/maps">
                    {t("footer.address")}
                  </a>
                </div>
              </div>
            </div>

            {/* Columna 4: Legal (Unificando rutas) */}
            <div className="footer-column">
              <h3>{t("footer.titles.legal")}</h3>
              <div className="footer-items">
                {menuItemsLegalDocs.map((item) => (
                  <NavLink
                    key={item.path}
                    to={getPath(item.path)}
                    end={item.end}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <hr />

          {/* Bottom Bar: Copyright y Pagos */}
          <div className="footer-columns">
            <p className="footer-copyright">
              © {new Date().getFullYear()} {t("footer.copyright")}
            </p>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <img key={method.name} src={method.icon} alt={method.name} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
