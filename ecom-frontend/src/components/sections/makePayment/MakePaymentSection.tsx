import { useTranslation } from "react-i18next";
import Container from "@/layouts/Container";
import CommonButton from "@/components/atoms/CommonButton";
import Input from "@/components/atoms/Input";
import { visa, mastercard, americanExpress, paypal } from "@/assets";

export default function MakePaymentSection() {
  const { t } = useTranslation("payment");

  return (
    <Container>
      <section className="make-payment-section">
        <div className="make-payment-main">
          <div className="make-payment-content">
            <div className="make-payment-header">
              <h1>{t("title")}</h1>
              <p>{t("subtitle")}</p>
            </div>

            <div className="make-payment-step">
              <p className="make-payment-step__label">1. {t("paymentMethod.title")}</p>
              <div className="make-payment-method-card">
                <div className="make-payment-method-card__top">
                  <div className="make-payment-method-badge">{t("paymentMethod.method")}</div>
                  <div className="make-payment-method-icons">
                    <img src={visa} alt="Visa" />
                    <img src={mastercard} alt="Mastercard" />
                    <img src={americanExpress} alt="American Express" />
                    <img src={paypal} alt="PayPal" />
                  </div>
                </div>
                <p className="make-payment-method-description">
                  {t("paymentMethod.description")}
                </p>
                <CommonButton variant="primary-full-width">
                  {t("paymentMethod.button")}
                </CommonButton>
                <p className="make-payment-method-terms">
                  {t("paymentMethod.terms")}
                </p>
              </div>
            </div>

            <div className="make-payment-step">
              <p className="make-payment-step__label">2. {t("contactData.title")}</p>
              <div className="make-payment-contact-form">
                <Input label={t("contactData.fullName")} placeholder={t("contactData.fullNamePlaceholder")} />
                <Input label={t("contactData.phone")} placeholder={t("contactData.phonePlaceholder")} />
                <Input label={t("contactData.address")} placeholder={t("contactData.addressPlaceholder")} />
                <Input label={t("contactData.city")} placeholder={t("contactData.cityPlaceholder")} />
                <CommonButton variant="primary">{t("contactData.saveButton")}</CommonButton>
              </div>
            </div>
          </div>

          <aside className="make-payment-summary">
            <div className="make-payment-summary__box">
              <h2>{t("summary.title")}</h2>
              <div className="make-payment-summary__item">
                <p>{t("summary.product")}</p>
                <span>$3.500</span>
              </div>
              <div className="make-payment-summary__item">
                <p>{t("summary.subtotal")}</p>
                <span>$0.00</span>
              </div>
              <div className="make-payment-summary__item">
                <p>{t("summary.shipping")}</p>
                <span>{t("summary.shippingFree")}</span>
              </div>
              <div className="make-payment-summary__item make-payment-summary__item--total">
                <p>{t("summary.total")}</p>
                <span>$3.500</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Container>
  );
}
