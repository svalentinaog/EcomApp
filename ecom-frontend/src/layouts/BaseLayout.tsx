import { useParams, Outlet, useLocation } from "react-router-dom";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import CallToAction from "@/layouts/CallToAction";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useLanguageSync } from "@/hooks/useLanguageSync";

export default function BaseLayout() {
  useScrollToTop();
  useLanguageSync();

  const { lang } = useParams();
  const location = useLocation();

  const CTA_EXCLUDE_PREFIXES = ["/contact", "/legal", "/login", "/register", "/recover-password", "/new-password", "/cart"];

  const pathWithoutLang =
    lang && location.pathname.startsWith(`/${lang}`)
      ? location.pathname.slice(`/${lang}`.length) || "/"
      : location.pathname;

  const shouldRenderCTA = !CTA_EXCLUDE_PREFIXES.some((prefix) =>
    pathWithoutLang.startsWith(prefix)
  );

  return (
    <div className="layout-wrapper">
      <Header />

      <main className="layout-main">
        <Outlet />
      </main>

      {shouldRenderCTA && <CallToAction />}

      <Footer />
    </div>
  );
}
