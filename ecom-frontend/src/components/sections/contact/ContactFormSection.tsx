import Container from "@/layouts/Container";
import ContactForm from "@/components/molecules/contact/ContactForm";
import { useTranslation } from "react-i18next";

export default function ContactFormSection() {
  const { t } = useTranslation("contact");

  return (
    <Container>
      <section className="contact-form-section">
        {/* Text content 50% */}
        <div className="text-content-contact-form-section">
          <h2>{t("formSection.title")}</h2>
          <p>{t("formSection.description")}</p>
        </div>
        {/* Form content 50% */}
        <ContactForm />
      </section>
    </Container>
  );
}
