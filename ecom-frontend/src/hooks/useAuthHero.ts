import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

type AuthMode = "login" | "register" | "recover-password" | "new-password";

export function useAuthHero(mode: AuthMode = "login") {
  const { t } = useTranslation("common");
  const { lang } = useParams();

  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  const isRegister = mode === "register";
  const isRecover = mode === "recover-password";
  const isNewPassword = mode === "new-password";

  return {
    t,
    getPath,
    isRegister,
    isRecover,
    isNewPassword,
  };
}
