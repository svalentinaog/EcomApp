import { useTranslation } from "react-i18next";
import type { LegalDocument } from "@/types/LegalDocument";
import Container from "@/layouts/Container";

interface LegalContentSectionProps {
  data: LegalDocument;
}

export default function LegalContentSection({
  data,
}: LegalContentSectionProps) {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "es") || "es";

  if (!data) return null;

  return (
    <Container>
      <section className="legal-section">
        <div className="legal-section__head">
          <h2 className="legal-section__title">{data.title[currentLang]}</h2>
          <small className="legal-section__update">
            {currentLang === "es" ? "Última actualización: " : "Last updated: "}
            {data.lastUpdated[currentLang]}
          </small>
        </div>

        <hr />

        <div className="legal-section__body">
          {data.sections.map((section, index) => (
            <article key={index} className="legal-block">
              {section.subtitle[currentLang] && (
                <h3 className="legal-block__subtitle">
                  {section.subtitle[currentLang]}
                </h3>
              )}
              {/* Mapeo de múltiples párrafos */}
              <div className="legal-block__paragraphs">
                {section.paragraphs[currentLang].map((text, pIndex) => (
                  <p key={pIndex} className="legal-block__text">
                    {text}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
