import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/Product";

export function useProductCard(product: Product) {
  const { t, i18n } = useTranslation("shop");
  const currentLang = (i18n.language as "es" | "en") || "es";
  const displayName = product.name[currentLang];

  const navigate = useNavigate();
  const { lang } = useParams();
  const { addToCart } = useCart();

  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  const handleCardClick = () => {
    navigate(getPath(`/product/${product.id}`));
  };

  const handleAddToCart = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    addToCart(product);
  };

  return {
    t,
    currentLang,
    displayName,
    handleCardClick,
    handleAddToCart,
    getPath,
  };
}
