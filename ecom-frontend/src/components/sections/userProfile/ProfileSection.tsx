import { useTranslation } from "react-i18next";
import { useMemo, useEffect } from "react"; // 1. Importamos useEffect
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Container from "@/layouts/Container";

import ProfileTab from "@/components/organisms/profile/ProfileTab";
import OrdersTab from "@/components/organisms/profile/OrdersTab";
import AddressesTab from "@/components/organisms/profile/AddressesTab";

export default function ProfileSection() {
  const { t, i18n } = useTranslation("profile"); 
  const navigate = useNavigate();
  const { lang = "es" } = useParams<{ lang: string }>();
  const location = useLocation();

  // Sincroniza el idioma de i18next con el parámetro de la URL
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const activeTab = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get("tab");
    
    if (tabParam === "orders" || tabParam === "addresses") {
      return tabParam;
    }
    
    return location.state?.tab || "profile";
  }, [location.search, location.state]);

  const handleTabChange = (tab: "profile" | "orders" | "addresses") => {
    navigate(`/${lang}/profile?tab=${tab}`);
  };

  return (
    <Container className="user-profile__container">
      <div className="user-profile__left">
        <ul className="user-profile__menu">
          <li 
            className={`user-profile__menu-item ${activeTab === "profile" ? "user-profile__menu-item--active" : ""}`}
            onClick={() => handleTabChange("profile")}
          >
            {t("menu.profile")}
          </li>
          <li 
            className={`user-profile__menu-item ${activeTab === "orders" ? "user-profile__menu-item--active" : ""}`}
            onClick={() => handleTabChange("orders")}
          >
            {t("menu.orders")}
          </li>
          <li 
            className={`user-profile__menu-item ${activeTab === "addresses" ? "user-profile__menu-item--active" : ""}`}
            onClick={() => handleTabChange("addresses")}
          >
            {t("menu.addresses")}
          </li>
        </ul>
      </div>
      
      <div className="user-profile__right">
        {activeTab === "profile" ? (
          <ProfileTab />
        ) : activeTab === "orders" ? (
          <OrdersTab />
        ) : (
          <AddressesTab />
        )}
      </div>
    </Container>
  );
}