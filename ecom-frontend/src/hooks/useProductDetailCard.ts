import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/Product";

export function useProductDetailCard(product: Product) {
  const { t, i18n } = useTranslation("shop");
  const currentLang = (i18n.language as "es" | "en") || "es";
  const displayName = product.name[currentLang];
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return {
    t,
    currentLang,
    displayName,
    quantity,
    setQuantity,
    handleAddToCart,
  };
}
