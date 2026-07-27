import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/useCart";
import CartTable from "@/components/molecules/cart/CartTable";
import CartDivider from "@/components/molecules/cart/CartDivider";
import CartSummary from "@/components/molecules/cart/CartSummary";
import EmptyCart from "@/components/molecules/cart/EmptyCart";
import Container from "@/layouts/Container";

export default function CartTableSection() {
  const { t, i18n } = useTranslation("common");
  const currentLang = i18n.language;

  // Extraemos todo directamente del hook de TanStack Query
  const { cartItems, isLoading, totalAmount, totalItems, removeFromCart, updateQuantity } = useCart();

  const cartLabels = {
    columns: {
      product: t("cart.columns.product"),
      price: t("cart.columns.price"),
      quantity: t("cart.columns.quantity"),
      total: t("cart.columns.total"),
      remove: t("cart.columns.remove"),
    },
    summary: {
      title: t("cart.summary.title"),
      quantityProducts: t("cart.summary.quantityProducts"),
      subtotal: t("cart.summary.subtotal"),
      shipping: t("cart.summary.shipping"),
      shippingFree: t("cart.summary.shippingFree"),
      total: t("cart.summary.total"),
      checkoutButton: t("cart.checkoutButton"),
    },
  };

  if (isLoading) {
    return <p style={{ textAlign: "center", padding: "2rem" }}>Cargando carrito...</p>;
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Container>
      <div className="cart-content">
        <CartTable
          items={cartItems}
          currentLang={currentLang}
          columns={cartLabels.columns}
          onQuantityChange={updateQuantity}
          onRemove={removeFromCart}
        />

        <CartDivider />

        <CartSummary
          subtotal={totalAmount}
          total={totalAmount}
          quantityProducts={totalItems}
          labels={cartLabels.summary}
        />
      </div>
    </Container>
  );
}