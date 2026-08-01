import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

type AuthMode = "login" | "register" | "forgot-password" | "reset-password";

export function useAuthHero(mode: AuthMode = "login") {
  const { t } = useTranslation("common");
  const { lang } = useParams();

  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  const isRegister = mode === "register";
  const isForgot = mode === "forgot-password";
  const isResetPassword = mode === "reset-password";

  return {
    t,
    getPath,
    isRegister,
    isForgot,
    isResetPassword,
  };
}
