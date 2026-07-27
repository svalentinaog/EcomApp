import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthHero } from "@/hooks/useAuthHero";
import CommonButton from "@/components/atoms/CommonButton";
import CustomInput from "@/components/atoms/CustomInput";
import Container from "@/layouts/Container";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

interface HeroSectionProps {
  mode?: "login" | "register" | "recover-password" | "new-password";
}

export default function HeroSection({ mode = "login" }: HeroSectionProps) {
  const { t, getPath, isRegister, isRecover, isNewPassword } = useAuthHero(mode);
  
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    birth_date: "",
  });

  const [ageError, setAgeError] = useState("");

  // Calculamos la fecha máxima permitida (hace 18 años exactos)
  const getMaxBirthDate = () => {
    const today = new Date();
    const year = today.getFullYear() - 18;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const authMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (isRegister) {
        const response = await api.post("/register", data);
        return response.data;
      } else {
        const response = await api.post("/login", {
          email: data.email,
          password: data.password,
        });
        return response.data;
      }
    },
    onSuccess: (data) => {
      const token = data?.access_token || data?.token;
      if (token) {
        setToken(token);
        navigate("/es");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validación extra de seguridad en tiempo real para la edad
    if (name === "birth_date" && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        setAgeError("Debes ser mayor de 18 años para registrarte.");
      } else {
        setAgeError("");
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && ageError) return; // Evita enviar si es menor de edad
    authMutation.mutate(formData);
  };

  const errorMessage = authMutation.error 
    ? (authMutation.error as any).response?.data?.message || "Ocurrió un error"
    : "";

  return (
    <section className="auth-section">
      <Container>
        <div className="auth-form-container">
          <h1 className="auth-title">
            {isRegister
              ? t("register.title")
              : isRecover
              ? t("recoverPassword.title")
              : isNewPassword
              ? t("newPassword.title")
              : t("login.title")}
          </h1>

          {authMutation.isError && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>
          )}

          {ageError && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{ageError}</p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <CustomInput
                  label={t("register.name")}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("register.namePlaceholder")}
                />
                <CustomInput
                  label="Fecha de nacimiento"
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  max={getMaxBirthDate()}
                />
              </>
            )}

            {(isRegister || isRecover || !isNewPassword) && (
              <CustomInput
                label={
                  isRecover
                    ? t("recoverPassword.email")
                    : isRegister
                    ? t("register.email")
                    : t("login.email")
                }
                type={isRecover || isRegister || !isNewPassword ? "email" : "text"}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  isRecover
                    ? t("recoverPassword.emailPlaceholder")
                    : isRegister
                    ? t("register.emailPlaceholder")
                    : t("login.emailPlaceholder")
                }
              />
            )}

            {(isRegister || !isRecover) && (
              <CustomInput
                label={
                  isNewPassword
                    ? t("newPassword.newPassword")
                    : isRegister
                    ? t("register.password")
                    : t("login.password")
                }
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isNewPassword
                    ? t("newPassword.newPasswordPlaceholder")
                    : isRegister
                    ? t("register.passwordPlaceholder")
                    : t("login.passwordPlaceholder")
                }
              />
            )}

            {(isRegister || isNewPassword) && (
              <CustomInput
                label={
                  isNewPassword
                    ? t("newPassword.confirmPassword")
                    : t("register.confirmPassword")
                }
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder={
                  isNewPassword
                    ? t("newPassword.confirmPasswordPlaceholder")
                    : t("register.confirmPasswordPlaceholder")
                }
              />
            )}

            {!isRegister && !isRecover && !isNewPassword && (
              <div className="auth-options">
                <label className="auth-checkbox-label">
                  <input type="checkbox" />
                  {t("login.rememberMe")}
                </label>
                <Link
                  to={getPath("/recover-password")}
                  className="auth-link"
                >
                  {t("login.forgotPassword")}
                </Link>
              </div>
            )}

            <CommonButton 
              variant="primary-full-width" 
              type="submit"
              disabled={authMutation.isPending || !!ageError}
            >
              {authMutation.isPending ? "Cargando..." : (
                isNewPassword
                  ? t("newPassword.changeButton")
                  : isRecover
                  ? t("recoverPassword.sendButton")
                  : isRegister
                  ? t("register.registerButton")
                  : t("login.loginButton")
              )}
            </CommonButton>

            {(isRecover || isNewPassword) && (
              <p className="auth-footer-text">
                <Link
                  to={getPath("/login")}
                  className="auth-link"
                >
                  {t("newPassword.loginLink")}
                </Link>
              </p>
            )}

            {!isRecover && !isNewPassword && (
              <p className="auth-footer-text">
                {isRegister
                  ? t("register.haveAccount")
                  : t("login.noAccount")}{" "}
                <Link
                  to={getPath(isRegister ? "/login" : "/register")}
                  className="auth-link"
                >
                  {isRegister
                    ? t("register.loginNow")
                    : t("login.registerNow")}
                </Link>
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}