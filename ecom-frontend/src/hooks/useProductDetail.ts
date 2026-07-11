import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "@/types/Product";
import productsData from "@/data/products.json";

export function useProductDetail() {
  const { id } = useParams();

  const product = useMemo(
    () => productsData.find((p) => p.id === Number(id)) || null,
    [id],
  ) as Product | null;

  return {
    product,
  };
}
