import { useState } from "react";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthHero } from "@/hooks/ui/useAuthHero";
import CommonButton from "@/components/atoms/CommonButton";
import CustomInput from "@/components/atoms/CustomInput";
import Container from "@/layouts/Container";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { validateAge } from "@/utils/validation";

interface HeroSectionProps {
  mode?: "login" | "register" | "forgot-password" | "reset-password";
}

export default function HeroSection({ mode = "login" }: HeroSectionProps) {
  const { t, getPath, isRegister, isForgot, isResetPassword } = useAuthHero(mode);
  
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const resetEmail = searchParams.get("email");

  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const isRemembered = useAuthStore((state) => state.rememberMe);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    birth_date: "",
    rememberMe: isRemembered,
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
      }

      if (isForgot) {
        const response = await api.post("/forgot-password", { email: data.email });
        return response.data;
      }

      if (isResetPassword) {
        const response = await api.post("/reset-password", {
          token: resetToken,
          email: resetEmail,
          password: data.password,
          password_confirmation: data.password_confirmation,
        });
        return response.data;
      }

      // login
      const response = await api.post("/login", {
        email: data.email,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (isForgot) {
        setSuccessMessage(t("login.recoveryEmailSent"));
        return;
      }

      if (isResetPassword) {
        navigate(getPath("/login"));
        return;
      }

      const token = data?.access_token || data?.token;
      if (token) {
        setToken(token, formData.rememberMe);
        const redirectTo = (location.state as { from?: string } | null)?.from || getPath("/");
        navigate(redirectTo, { replace: true });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "birth_date" && value) {
      setAgeError(validateAge(value));
    }

    setFormData({
      ...formData,
      [name]: name === "rememberMe" ? (e.target.checked as unknown as string) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && ageError) return;
    setSuccessMessage("");
    authMutation.mutate({
      ...formData,
      rememberMe: formData.rememberMe,
    } as typeof formData);
  };

  const errorMessage = authMutation.error 
    ? (authMutation.error as any).response?.data?.message || t("login.genericError")
    : "";

  return (
    <section className="auth-section">
      <Container>
        <div className="auth-form-container">
          <h1 className="auth-title">
            {isRegister
              ? t("register.title")
              : isForgot
              ? t("recoverPassword.title")
              : isResetPassword
              ? t("newPassword.title")
              : t("login.title")}
          </h1>

          {authMutation.isError && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>
          )}

          {ageError && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{ageError}</p>
          )}

          {successMessage && (
            <p style={{ color: "green", marginBottom: "1rem" }}>{successMessage}</p>
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

            {(isRegister || isForgot || !isResetPassword) && (
              <CustomInput
                label={
                  isForgot
                    ? t("recoverPassword.email")
                    : isRegister
                    ? t("register.email")
                    : t("login.email")
                }
                type={isForgot || isRegister || !isResetPassword ? "email" : "text"}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  isForgot
                    ? t("recoverPassword.emailPlaceholder")
                    : isRegister
                    ? t("register.emailPlaceholder")
                    : t("login.emailPlaceholder")
                }
              />
            )}

            {(isRegister || !isForgot) && (
              <CustomInput
                label={
                  isResetPassword
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
                  isResetPassword
                    ? t("newPassword.newPasswordPlaceholder")
                    : isRegister
                    ? t("register.passwordPlaceholder")
                    : t("login.passwordPlaceholder")
                }
              />
            )}

            {(isRegister || isResetPassword) && (
              <CustomInput
                label={
                  isResetPassword
                    ? t("newPassword.confirmPassword")
                    : t("register.confirmPassword")
                }
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder={
                  isResetPassword
                    ? t("newPassword.confirmPasswordPlaceholder")
                    : t("register.confirmPasswordPlaceholder")
                }
              />
            )}

            {!isRegister && !isForgot && !isResetPassword && (
              <div className="auth-options">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.rememberMe)}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        rememberMe: event.target.checked,
                      });
                    }}
                  />
                  {t("login.rememberMe")}
                </label>
                <Link
                  to={getPath("/forgot-password")}
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
              {authMutation.isPending ? t("loading") : (
                isResetPassword
                  ? t("newPassword.changeButton")
                  : isForgot
                  ? t("recoverPassword.sendButton")
                  : isRegister
                  ? t("register.registerButton")
                  : t("login.loginButton")
              )}
            </CommonButton>

            {(isForgot || isResetPassword) && (
              <p className="auth-footer-text">
                <Link
                  to={getPath("/login")}
                  className="auth-link"
                >
                  {t("newPassword.loginLink")}
                </Link>
              </p>
            )}

            {!isForgot && !isResetPassword && (
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