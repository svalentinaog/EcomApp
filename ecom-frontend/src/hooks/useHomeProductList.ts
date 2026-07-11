import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import type { Product } from "@/types/Product";
import productsData from "@/data/products.json";

export function useHomeProductList() {
  const [filter, setFilter] = useState<string>("all");
  const { t, i18n } = useTranslation("home");
  const currentLang = (i18n.language as "es" | "en") || "es";
  const { lang } = useParams();

  const products = productsData as Product[];

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category[currentLang]))),
    [currentLang, products],
  );

  const filteredProducts = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((p) => p.category[currentLang] === filter),
    [filter, products, currentLang],
  );

  const displayProducts = useMemo(() => filteredProducts.slice(0, 8), [filteredProducts]);

  const getPath = (path: string) => `/${lang}${path === "/" ? "" : path}`;

  return {
    filter,
    setFilter,
    categories,
    displayProducts,
    t,
    getPath,
  };
}
