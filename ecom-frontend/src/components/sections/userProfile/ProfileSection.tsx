import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Container from "@/layouts/Container";
import Input from "@/components/atoms/CustomInput";
import CommonButton from "@/components/atoms/CommonButton";
import EmptyState from "@/components/molecules/common/EmptyState";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";

import AddressesTab from "@/components/organisms/profile/AddressesTab";

import loadingIcon from "@/assets/icons/loading-icon.png";
import noOrdersImg from "@/assets/images/no-orders.jpg"; 
import OrdersTab from "@/components/organisms/profile/OrdersTab";

export default function ProfileSection() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { lang = "es" } = useParams<{ lang: string }>();
  
  const logout = () => useAuthStore.setState({ token: null });

  const location = useLocation(); // ubicación actual

  // Inicializamos la pestaña leyendo el estado de la navegación, si no hay, por defecto "profile"
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">(
    location.state?.tab || "profile"
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await api.get("/user");
        
        let formattedDate = "";
        if (data.birth_date) {
          formattedDate = data.birth_date.split("T")[0]; 
        }

        setFormData({
          fullName: data.name || "",
          email: data.email || "",
          birthDate: formattedDate,
        });
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put("/profile", {
        name: formData.fullName,
        email: formData.email,
        birth_date: formData.birthDate,
      });
      setMessage("¡Datos actualizados con éxito!");
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMessage("Ocurrió un error al actualizar los datos.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate(`/${lang}/login`);
  };

  if (loading) {
    return (
      <Container>
        <div className="loading">
          <img 
            src={loadingIcon} 
            alt={t("loading")} 
            className="w-16 h-16 animate-spin opacity-60" 
          />
        </div>
      </Container>
    );
  }

  return (
    <Container className="user-profile__container">
      <div className="user-profile__left">
        <ul className="user-profile__menu">
          {/* Clickeable con renderizado condicional de la clase activa */}
          <li 
            className={`user-profile__menu-item ${activeTab === "profile" ? "user-profile__menu-item--active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Mi Perfil
          </li>
          <li 
            className={`user-profile__menu-item ${activeTab === "addresses" ? "user-profile__menu-item--active" : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            Mis Direcciones
          </li>
          <li 
            className={`user-profile__menu-item ${activeTab === "orders" ? "user-profile__menu-item--active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Mis Pedidos
          </li>
        </ul>
      </div>
      
      <div className="user-profile__right">
        {/* Renderizado condicional basado en la pestaña seleccionada */}
        {activeTab === "profile" ? (
          <>
            <h1 className="user-profile__title">Mi perfil</h1>
            <p className="user-profile__subtitle">
              Gestiona tu información personal y preferencias de cuenta.
            </p>

            {message && (
              <p style={{ margin: "1rem 0", color: message.includes("éxito") ? "green" : "red" }}>
                {message}
              </p>
            )}

            <form className="user-profile__form" onSubmit={handleSubmit}>
              <h2 className="user-profile__section-title">Información Personal</h2>
              
              <div className="user-profile__form-group">
                <Input
                  type="text"
                  name="fullName"
                  label="Nombre completo"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="user-profile__form-group">
                <Input
                  type="email"
                  name="email"
                  label="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="user-profile__form-group">
                <Input
                  type="date"
                  name="birthDate"
                  label="Fecha de nacimiento"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1.5rem" }}>
                <CommonButton type="submit" variant="primary" className="user-profile__submit-btn">
                  Actualizar Datos
                </CommonButton>
                
                <CommonButton 
                  type="button" 
                  variant="primary" 
                  onClick={handleLogout} 
                  style={{ backgroundColor: "#A70000", color: "#fff", border: "none" }}
                >
                  Cerrar Sesión
                </CommonButton>
              </div>
            </form>
          </>
        ) : activeTab === "orders" ? (
          <>
            <h1 className="user-profile__title">Mis pedidos</h1>
            <p className="user-profile__subtitle">
              Consulta el estado y el historial de todos tus pedidos.
            </p>

            <OrdersTab />
          </>
        ) : (
          <>
            <h1 className="user-profile__title">Mis direcciones</h1>
            <p className="user-profile__subtitle">
              Administra las direcciones donde quieres recibir tus pedidos.
            </p>

            <AddressesTab />
          </>
        )}
      </div>
    </Container>
  );
}