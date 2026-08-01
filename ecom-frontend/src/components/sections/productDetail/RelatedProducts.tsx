import { useMemo } from "react";
import Container from "@/layouts/Container";
import { useTranslation } from "react-i18next";
import type { Product } from "@/types/Product";
import ProductCard from "@/components/molecules/common/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function RelatedProducts({ currentProduct }: { currentProduct: Product }) {
  const { t } = useTranslation("shop");
  const { data: products = [] } = useProducts();

  // Filtramos los productos de la misma subcategoría y excluimos el producto actual
  const relatedProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.subcategory_id === currentProduct.subcategory_id &&
          product.id !== currentProduct.id
      )
      .slice(0, 4); // Limitamos a 4 productos como en el diseño
  }, [products, currentProduct]);

  // Si no hay productos relacionados, no renderizamos la sección
  if (relatedProducts.length === 0) {
    return null; 
  }

  return (
    <Container>
      <div className="products">
        <h2 style={{ textAlign: "left", width: "100%" }}>
          {t("relatedProducts.title")}
        </h2>
        <div className="product-list-related">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </Container>
  );
}