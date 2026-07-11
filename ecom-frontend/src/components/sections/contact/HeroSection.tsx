import Container from "@/layouts/Container";
import { imageSection } from "@/assets";

import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation("contact");
  return (
    <section className="bg-section-home">
      <Container>
        <div className="hero-section-home">
          <div className="text-content-home">
            <span>{t("hero.subtitle")}</span>
            <h1>{t("hero.title")}</h1>
            <p>{t("hero.description")}</p>
          </div>
          <div className="container-image-home">
            <img
              className="image-home"
              src={imageSection}
              alt="Imagen destacada"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
