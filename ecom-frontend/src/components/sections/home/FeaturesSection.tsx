import { packaging, shipping, support } from "@/assets";
import Container from "@/layouts/Container";

import { useTranslation } from "react-i18next";

export default function FeaturesSection() {
  const { t } = useTranslation("home");
  return (
    <section className="bg-section-features">
      <Container>
        <div className="hero-section-features">
          <div className="feature-item">
            <img src={shipping} alt="Envío gratis" />
            <div>
              <h3>{t("benefits.shipping.title")}</h3>
              <p>{t("benefits.shipping.description")}</p>
            </div>
          </div>
          <div className="separator"></div>
          <div className="feature-item">
            <img src={packaging} alt="Devoluciones en 30 días" />
            <div>
              <h3>{t("benefits.returns.title")}</h3>
              <p>{t("benefits.returns.description")}</p>
            </div>
          </div>
          <div className="separator"></div>
          <div className="feature-item">
            <img src={support} alt="Soporte 24/7" />
            <div>
              <h3>{t("benefits.support.title")}</h3>
              <p>{t("benefits.support.description")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
