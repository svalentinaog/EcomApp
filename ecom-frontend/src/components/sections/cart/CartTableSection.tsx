import CartTable from "@/components/molecules/cart/CartTable";
import CartDivider from "@/components/molecules/cart/CartDivider";
import CartSummary from "@/components/molecules/cart/CartSummary";
import EmptyCart from "@/components/molecules/cart/EmptyCart";
import { useCartHero } from "@/hooks/useCartHero";
import Container from "@/layouts/Container";

export default function CartTableSection() {
  const {
    t,
    currentLang,
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCartHero();

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

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  const totalAmount = getCartTotal();
  const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);

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
