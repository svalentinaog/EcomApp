import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

import CommonButton from "@/components/atoms/CommonButton";
import CustomInput from "@/components/atoms/CustomInput";
import LoandingState from "@/components/molecules/common/LoadingState";
import { validateProfileForm } from "@/utils/validation";

export default function ProfileTab() {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const { lang = "es" } = useParams<{ lang: string }>();
  
  const logout = () => useAuthStore.setState({ token: null });

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
    return <LoandingState />;
  }

  const errors = validateProfileForm(formData);
  const hasErrors = errors.length > 0;

  return (
    <div className="profile-tab">
      <h1 className="user-profile__title">{t("profileSection.title")}</h1>
      <p className="user-profile__subtitle">{t("profileSection.subtitle")}</p>

      {message && (
        <p style={{ margin: "1rem 0", color: message.includes("éxito") ? "green" : "red" }}>
          {message}
        </p>
      )}

      {hasErrors && (
        <ul style={{ color: "red", margin: "0 0 1rem 1rem" }}>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <form className="user-profile__form" onSubmit={handleSubmit}>
        <h2 className="user-profile__section-title">{t("profileSection.personalInfo")}</h2>

        <div className="user-profile__form-group">
          <CustomInput
            type="text"
            name="fullName"
            label={t("profileSection.fullName")}
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="user-profile__form-group">
          <CustomInput
            type="email"
            name="email"
            label={t("profileSection.email")}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="user-profile__form-group">
          <CustomInput
            type="date"
            name="birthDate"
            label={t("profileSection.birthDate")}
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1.5rem" }}>
          <CommonButton type="submit" variant="primary" className="user-profile__submit-btn">
            {t("profileSection.updateButton")}
          </CommonButton>

          <CommonButton type="button" variant="danger" onClick={handleLogout}>
            {t("profileSection.logoutButton")}
          </CommonButton>
        </div>
      </form>
    </div>
  );
}