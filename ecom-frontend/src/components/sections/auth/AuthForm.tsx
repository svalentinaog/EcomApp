import { useState } from "react";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthHero } from "@/hooks/ui/useAuthHero";
import CommonButton from "@/components/atoms/CommonButton";
import CustomInput from "@/components/atoms/CustomInput";
import InlineAlert from "@/components/molecules/common/InlineAlert";
import Container from "@/layouts/Container";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import {
  validateAge,
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from "@/utils/validation";

interface AuthFormProps {
  mode?: "login" | "register" | "forgot-password" | "reset-password";
}

export default function AuthForm({ mode = "login" }: AuthFormProps) {
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

  // Objeto de errores por campo para los CustomInput
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getMaxBirthDate = () => {
    const today = new Date();
    const year = today.getFullYear() - 18;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Valida un solo campo con las mismas reglas que usa el backend.
  // Se reutiliza tanto en cada tecla (handleChange) como al enviar (validateForm),
  // así nunca quedan desincronizados entre "mientras escribes" y "al enviar".
  const validateSingleField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return isRegister ? validateName(value) : "";
      case "email":
        return isRegister || isForgot || !isResetPassword ? validateEmail(value) : "";
      case "password":
        return isRegister || !isResetPassword
          ? validatePassword(value, isRegister || isResetPassword)
          : "";
      case "password_confirmation":
        return isRegister || isResetPassword
          ? validatePasswordConfirmation(formData.password, value)
          : "";
      case "birth_date":
        return isRegister ? validateAge(value) : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {
      name: validateSingleField("name", formData.name),
      email: validateSingleField("email", formData.email),
      password: validateSingleField("password", formData.password),
      password_confirmation: validateSingleField(
        "password_confirmation",
        formData.password_confirmation
      ),
      birth_date: validateSingleField("birth_date", formData.birth_date),
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (type === "checkbox") return;

    setErrors((prev) => {
      const updated = { ...prev, [name]: validateSingleField(name, value) };

      // Si edita la contraseña después de ya haber escrito la confirmación,
      // revalida también ese campo para no dejar un error desactualizado.
      if (name === "password" && formData.password_confirmation) {
        updated.password_confirmation = validatePasswordConfirmation(
          value,
          formData.password_confirmation
        );
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    authMutation.mutate({
      ...formData,
      rememberMe: formData.rememberMe,
    } as typeof formData);
  };

  const getErrorMessage = () => {
    const err = authMutation.error as any;
    const apiMessage = err?.response?.data?.message;

    if (typeof apiMessage === "string") return apiMessage;
    if (Array.isArray(apiMessage)) return apiMessage[0];

    const translated = t("login.genericError");
    return typeof translated === "string" ? translated : "Ocurrió un error inesperado.";
  };

  const errorMessage = authMutation.isError ? getErrorMessage() : "";

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

          {/* Alerta global para errores de la API */}
          {authMutation.isError && (
            <div style={{ marginBottom: "1.5rem" }}>
              <InlineAlert variant="danger" message={errorMessage} />
            </div>
          )}

          {/* Alerta global para mensajes de éxito */}
          {successMessage && (
            <div style={{ marginBottom: "1.5rem" }}>
              <InlineAlert variant="success" message={successMessage} />
            </div>
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
                  error={errors.name}
                />
                <CustomInput
                  label="Fecha de nacimiento"
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  max={getMaxBirthDate()}
                  error={errors.birth_date}
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
                error={errors.email}
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
                error={errors.password}
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
                error={errors.password_confirmation}
              />
            )}

            {!isRegister && !isForgot && !isResetPassword && (
              <div
                className="auth-options"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <label
                  className="auth-checkbox-label"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={Boolean(formData.rememberMe)}
                    onChange={handleChange}
                  />
                  {t("login.rememberMe")}
                </label>
                <Link to={getPath("/forgot-password")} className="auth-link">
                  {t("login.forgotPassword")}
                </Link>
              </div>
            )}

            <CommonButton
              variant="primary-full-width"
              type="submit"
              disabled={authMutation.isPending}
            >
              {authMutation.isPending
                ? t("loading")
                : isResetPassword
                ? t("newPassword.changeButton")
                : isForgot
                ? t("recoverPassword.sendButton")
                : isRegister
                ? t("register.registerButton")
                : t("login.loginButton")}
            </CommonButton>

            {(isForgot || isResetPassword) && (
              <p className="auth-footer-text" style={{ marginTop: "1rem", textAlign: "center" }}>
                <Link to={getPath("/login")} className="auth-link">
                  {t("newPassword.loginLink")}
                </Link>
              </p>
            )}

            {!isForgot && !isResetPassword && (
              <p className="auth-footer-text" style={{ marginTop: "1rem", textAlign: "center" }}>
                {isRegister ? t("register.haveAccount") : t("login.noAccount")}{" "}
                <Link to={getPath(isRegister ? "/login" : "/register")} className="auth-link">
                  {isRegister ? t("register.loginNow") : t("login.registerNow")}
                </Link>
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}