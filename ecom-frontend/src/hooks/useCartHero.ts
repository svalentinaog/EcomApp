import { useTranslation } from "react-i18next";
import { useCart } from "@/contexts/CartContext";

export function useCartHero() {
  const { t, i18n } = useTranslation("common");
  const { cart: cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const currentLang = (i18n.language as "es" | "en") || "es";

  return {
    t,
    currentLang,
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  };
}
