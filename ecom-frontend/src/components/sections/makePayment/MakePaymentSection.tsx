import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@/layouts/Container";
import CommonButton from "@/components/atoms/CommonButton";
import { visa, mastercard, americanExpress, paypal } from "@/assets";
import { useCart } from "@/hooks/api/useCart";
import { useAddresses } from "@/hooks/api/useAddresses";
import { useCheckout } from "@/hooks/api/useOrders";
import type { Address } from "@/types/Address";

export default function MakePaymentSection() {
  const { t } = useTranslation("payment");
  const navigate = useNavigate();
  const { lang = "es" } = useParams<{ lang: string }>();

  const { summary, cartItems } = useCart();
  const { addresses, isLoading: loadingAddresses, defaultAddress } = useAddresses();
  const { createOrder, isSubmitting } = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    if (defaultAddress && selectedAddressId === null) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress, selectedAddressId]);

  const handleGoToManageAddresses = () => {
    navigate(`/${lang}/profile`, { state: { tab: "addresses" } });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || !selectedAddressId) return;

    try {
      const response = await createOrder({
        payment_method: "mercado_pago",
        address_id: selectedAddressId,
      });

      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        navigate(`/${lang}/profile`, { state: { tab: "orders" } });
      }
    } catch (checkoutError) {
      console.error("Error al procesar el pago y generar la orden:", checkoutError);
    }
  };

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

                <CommonButton
                  variant="primary-full-width"
                  onClick={handleCheckout}
                  disabled={
                    isSubmitting ||
                    cartItems.length === 0 ||
                    !selectedAddressId
                  }
                >
                  {isSubmitting
                    ? "Procesando..."
                    : t("paymentMethod.button")}
                </CommonButton>

                <p className="make-payment-method-terms">
                  {t("paymentMethod.terms")}
                </p>
              </div>
            </div>

            <div className="make-payment-step">
              <p className="make-payment-step__label">2. Dirección de Envío</p>

              <div className="make-payment-address-selector">
                {loadingAddresses ? (
                  <p>Cargando tus direcciones...</p>
                ) : addresses.length === 0 ? (
                  <div className="make-payment-address-empty">
                    <p className="make-payment-address-empty__text">
                      No tienes ninguna dirección registrada.
                    </p>
                    <CommonButton variant="primary" onClick={handleGoToManageAddresses}>
                      + Crear nueva dirección
                    </CommonButton>
                  </div>
                ) : (
                  <div className="make-payment-address-list">
                    {addresses.map((address: Address) => {
                      const isSelected = selectedAddressId === address.id;

                      return (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`make-payment-address-option ${isSelected ? "make-payment-address-option--selected" : ""}`}
                        >
                          <div>
                            <div className="make-payment-address-option__header">
                              <strong className="make-payment-address-option__name">
                                {address.recipient_full_name}
                              </strong>

                              {address.is_default && (
                                <span className="make-payment-address-option__tag">
                                  Predeterminada
                                </span>
                              )}
                            </div>

                            <p className="make-payment-address-option__detail">
                              {address.address_line}
                            </p>

                            <p className="make-payment-address-option__detail make-payment-address-option__detail--muted">
                              {address.city}, {address.department} — {address.neighborhood}
                            </p>

                            {address.complement && (
                              <p className="make-payment-address-option__detail make-payment-address-option__detail--muted">
                                Complemento: {address.complement}
                              </p>
                            )}

                            <p className="make-payment-address-option__detail make-payment-address-option__detail--muted">
                              Teléfono: {address.phone}
                            </p>
                          </div>

                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="make-payment-address-option__radio"
                          />
                        </div>
                      );
                    })}

                    <div className="make-payment-address-actions">
                      <CommonButton
                        variant="primary"
                        onClick={handleGoToManageAddresses}
                      >
                        + Agregar o administrar direcciones
                      </CommonButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="make-payment-summary">
            <div className="make-payment-summary__box">
              <h2>{t("summary.title")}</h2>

              {cartItems.map((item) => (
                <div key={item.id} className="make-payment-summary__item">
                  <p>
                    {item.product.name} (x{item.quantity})
                  </p>
                  <span>
                    ${(Number(item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <hr className="make-payment-summary__divider" />

              <div className="make-payment-summary__item">
                <p>{t("summary.subtotal")}</p>
                <span>${summary.subtotal.toLocaleString()}</span>
              </div>
              <div className="make-payment-summary__item">
                <p>{t("summary.shipping")}</p>
                <span>
                  {summary.shippingCost === 0
                    ? t("summary.shippingFree")
                    : `$${summary.shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="make-payment-summary__item make-payment-summary__item--total">
                <p>{t("summary.total")}</p>
                <span>${summary.total.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Container>
  );
}