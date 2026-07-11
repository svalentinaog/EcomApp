import {
  addressContactPage,
  phoneContactPage,
  emailContactPage,
} from "@/assets";
import Container from "@/layouts/Container";

import { useTranslation } from "react-i18next";

export default function InfoSection() {
  const { t } = useTranslation("contact");
  return (
    <section className="bg-info-section">
      <Container>
        <div className="hero-info-section">
          <div className="info-item">
            <img
              src={addressContactPage}
              alt={t("infoSection.address.title")}
            />
            <div>
              <h3>{t("infoSection.address.title")}</h3>
              <p>{t("infoSection.address.description")}</p>
            </div>
          </div>

          <div className="info-item">
            <img src={emailContactPage} alt={t("infoSection.email.title")} />
            <div>
              <h3>{t("infoSection.email.title")}</h3>
              <p>{t("infoSection.email.description")}</p>
            </div>
          </div>

          <div className="info-item">
            <img src={phoneContactPage} alt={t("infoSection.phone.title")} />
            <div>
              <h3>{t("infoSection.phone.title")}</h3>
              <p>{t("infoSection.phone.description")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
