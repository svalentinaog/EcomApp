import { useAuthHero } from "@/hooks/useAuthHero";
import { Link } from "react-router-dom";
import CommonButton from "@/components/atoms/CommonButton";
import Input from "@/components/atoms/Input";
import Container from "@/layouts/Container";

interface HeroSectionProps {
  mode?: "login" | "register" | "recover-password" | "new-password";
}

export default function HeroSection({ mode = "login" }: HeroSectionProps) {
  const { t, getPath, isRegister, isRecover, isNewPassword } =
    useAuthHero(mode);

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
          <form className="auth-form">
            {isRegister && (
              <Input
                label={t("register.name")}
                type="text"
                placeholder={t("register.namePlaceholder")}
              />
            )}
            {(isRegister || isRecover || !isNewPassword) && (
              <Input
                label={
                  isRecover
                    ? t("recoverPassword.email")
                    : isRegister
                    ? t("register.email")
                    : t("login.email")
                }
                type={isRecover || isRegister || !isNewPassword ? "email" : "text"}
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
              <Input
                label={
                  isNewPassword
                    ? t("newPassword.newPassword")
                    : isRegister
                    ? t("register.password")
                    : t("login.password")
                }
                type="password"
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
              <Input
                label={
                  isNewPassword
                    ? t("newPassword.confirmPassword")
                    : t("register.confirmPassword")
                }
                type="password"
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
            <CommonButton variant="primary-full-width" type="submit">
              {isNewPassword
                ? t("newPassword.changeButton")
                : isRecover
                ? t("recoverPassword.sendButton")
                : isRegister
                ? t("register.registerButton")
                : t("login.loginButton")}
            </CommonButton>
            {(isRecover || isNewPassword) && (
              <p className="auth-footer-text">
                <Link
                  to={getPath("/login")}
                  className="auth-link"
                >
                  {isNewPassword
                    ? t("newPassword.loginLink")
                    :t("newPassword.loginLink")}
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
