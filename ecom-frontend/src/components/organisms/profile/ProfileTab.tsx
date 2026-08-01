import { useTranslation } from "react-i18next";
import CommonButton from "@/components/atoms/CommonButton";
import CustomInput from "@/components/atoms/CustomInput";
import Container from "@/layouts/Container";
import { validateProfileForm } from "@/utils/validation";

interface ProfileTabProps {
  formData: {
    fullName: string;
    email: string;
    birthDate: string;
  };
  loading: boolean;
  message: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onLogout: () => void;
}

export default function ProfileTab({
  formData,
  loading,
  message,
  onChange,
  onSubmit,
  onLogout,
}: ProfileTabProps) {
  const { t } = useTranslation("common");

  if (loading) {
    return null;
  }

  const errors = validateProfileForm(formData);
  const hasErrors = errors.length > 0;

  return (
    <>
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

      <form className="user-profile__form" onSubmit={onSubmit}>
        <h2 className="user-profile__section-title">{t("profileSection.personalInfo")}</h2>

        <div className="user-profile__form-group">
          <CustomInput
            type="text"
            name="fullName"
            label={t("profileSection.fullName")}
            value={formData.fullName}
            onChange={onChange}
          />
        </div>

        <div className="user-profile__form-group">
          <CustomInput
            type="email"
            name="email"
            label={t("profileSection.email")}
            value={formData.email}
            onChange={onChange}
          />
        </div>

        <div className="user-profile__form-group">
          <CustomInput
            type="date"
            name="birthDate"
            label={t("profileSection.birthDate")}
            value={formData.birthDate}
            onChange={onChange}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1.5rem" }}>
          <CommonButton type="submit" variant="primary" className="user-profile__submit-btn">
            {t("profileSection.updateButton")}
          </CommonButton>

          <CommonButton type="button" variant="danger" onClick={onLogout}>
            {t("profileSection.logoutButton")}
          </CommonButton>
        </div>
      </form>
    </>
  );
}
