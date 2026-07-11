import Container from "@/layouts/Container";
import { imageSection } from "@/assets";

import { useHomeHero } from "@/hooks/useHomeHero";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/CommonButton";

export default function HeroSection() {
  const { t, getPath } = useHomeHero();

  return (
    <section className="bg-section-home">
      <Container>
        <div className="hero-section-home">
          <div className="text-content-home">
            <span>{t("hero.badge")}</span>
            <h1>{t("hero.title")}</h1>
            <p>{t("hero.description")}</p>
            <div>
              <Button variant="white">
                <Link to={getPath("/shop")}>{t("hero.cta")}</Link>
              </Button>
            </div>
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
