import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Container from "@/layouts/Container";
import CommonButton from "@/components/atoms/CommonButton";
import { visa, mastercard, americanExpress, paypal } from "@/assets";
import { api } from "@/services/api";
import { useCart } from "@/hooks/useCart";
import { useAddresses, type Addresses } from "@/hooks/useAddresses";

export default function MakePaymentSection() {
  const { t } = useTranslation("payment");
  const navigate = useNavigate();
  const { lang = "es" } = useParams<{ lang: string }>();
  const queryClient = useQueryClient();

  // Hooks personalizados
  const { summary, cartItems } = useCart();
  const { addresses, isLoading: loadingAddresses, defaultAddress } = useAddresses();

  // Estado local para seleccionar la dirección activa para la compra
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Seleccionamos la dirección predeterminada cuando la lista esté disponible
  useEffect(() => {
    if (defaultAddress && selectedAddressId === null) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress, selectedAddressId]);

  // Redirección hacia la sección de direcciones del perfil
  const handleGoToManageAddresses = () => {
    navigate(`/${lang}/profile`, { state: { tab: "addresses" } });
  };

  // Mutación para crear la orden enviando el ID de la dirección seleccionada
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddressId) {
        throw new Error("Debes seleccionar una dirección de envío");
      }

      const { data } = await api.post("/orders", {
        payment_method: "mercado_pago",
        address_id: selectedAddressId,
      });
      return data;
    },
    // =====================================================================
    // START: Capturar la respuesta y redirigir a Mercado Pago
    // =====================================================================
    onSuccess: (response) => {
      // 1. Limpiamos el carrito en el estado global (React Query)
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // 2. Verificamos si el backend nos envió la URL de pago
      if (response.checkout_url) {
        // Redirigimos al usuario a la página de Mercado Pago
        window.location.href = response.checkout_url;
      } else {
        // Fallback: Si por alguna razón no hay URL, lo mandamos a sus órdenes
        navigate(`/${lang}/profile`, { state: { tab: "orders" } });
      }
    },
    // =====================================================================
    // END Capturar la respuesta y redirigir a Mercado Pago
    // =====================================================================
    onError: (error) => {
      console.error("Error al procesar el pago y generar la orden:", error);
    },
  });

  const handleCheckout = () => {
    if (cartItems.length === 0 || !selectedAddressId) return;
    createOrderMutation.mutate();
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

            {/* Paso 1: Método de Pago */}
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
                    createOrderMutation.isPending ||
                    cartItems.length === 0 ||
                    !selectedAddressId
                  }
                >
                  {createOrderMutation.isPending
                    ? "Procesando..."
                    : t("paymentMethod.button")}
                </CommonButton>

                <p className="make-payment-method-terms">
                  {t("paymentMethod.terms")}
                </p>
              </div>
            </div>

            {/* Paso 2: Selector de Dirección de Envío */}
            <div className="make-payment-step">
              <p className="make-payment-step__label">2. Dirección de Envío</p>

              <div className="make-payment-address-selector">
                {loadingAddresses ? (
                  <p>Cargando tus direcciones...</p>
                ) : addresses.length === 0 ? (
                  /* Estado sin direcciones guardadas */
                  <div
                    style={{
                      padding: "1.5rem",
                      textAlign: "center",
                      border: "1px dashed #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <p style={{ marginBottom: "1rem", color: "#666" }}>
                      No tienes ninguna dirección registrada.
                    </p>
                    <CommonButton variant="primary" onClick={handleGoToManageAddresses}>
                      + Crear nueva dirección
                    </CommonButton>
                  </div>
                ) : (
                  /* Direcciones disponibles */
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {addresses.map((address: Addresses) => {
                      const isSelected = selectedAddressId === address.id;

                      return (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          style={{
                            border: isSelected ? "2px solid #1f8955" : "1px solid #e5e7eb",
                            backgroundColor: isSelected ? "#f3fbf6" : "#ffffff",
                            padding: "1rem",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <strong style={{ fontSize: "1rem", color: "#111" }}>
                                {address.full_name}
                              </strong>
                              {address.is_default && (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    backgroundColor: "#e2e8f0",
                                    color: "#334155",
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Predeterminada
                                </span>
                              )}
                            </div>
                            <p style={{ margin: "0.25rem 0 0", color: "#4b5563", fontSize: "0.9rem" }}>
                              {address.address_line}
                            </p>
                            <p style={{ margin: "0.1rem 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
                              {address.city}, {address.state}, {address.postal_code} — {address.country}
                            </p>
                            <p style={{ margin: "0.25rem 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
                              Teléfono: {address.phone}
                            </p>
                          </div>

                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(address.id)}
                            style={{ marginTop: "4px", accentColor: "#1f8955", cursor: "pointer" }}
                          />
                        </div>
                      );
                    })}

                    <div style={{ marginTop: "0.5rem" }}>
                      <CommonButton
                        variant="primary"
                        onClick={handleGoToManageAddresses}
                        style={{
                          backgroundColor: "#f3f4f6",
                          color: "#1f2937",
                          border: "1px solid #d1d5db",
                        }}
                      >
                        + Agregar o administrar direcciones
                      </CommonButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
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

              <hr style={{ margin: "1rem 0", borderColor: "#eee" }} />

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