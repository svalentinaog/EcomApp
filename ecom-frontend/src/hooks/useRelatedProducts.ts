import { useMemo } from "react";
import type { Product } from "@/types/Product";
import productsData from "@/data/products.json";

export function useRelatedProducts(currentProduct: Product) {
  const relatedProducts = useMemo(
    () =>
      productsData
        .filter(
          (product) =>
            product.id !== currentProduct.id &&
            product.category.es === currentProduct.category.es,
        )
        .slice(0, 4),
    [currentProduct],
  );

  return {
    relatedProducts,
  };
}
