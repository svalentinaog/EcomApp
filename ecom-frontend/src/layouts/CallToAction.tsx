import Container from "@/layouts/Container";
import Button from "@/components/atoms/CommonButton";
import { imageSection } from "@/assets";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

export default function CallToAction() {
  const { t } = useTranslation("common");
  const { lang } = useParams();
  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  return (
    <section className="bg-section-CTA">
      <Container>
        <div className="hero-section-CTA">
          <div className="container-image-CTA">
            <img className="image-CTA" src={imageSection} alt={t("CTA.alt")} />
          </div>
          <div className="text-content-CTA">
            <h2>{t("CTA.title")}</h2>
            <p>{t("CTA.description")}</p>
            <div>
              <Button variant="primary">
                <Link to={getPath("/contact")}>{t("CTA.btn")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
