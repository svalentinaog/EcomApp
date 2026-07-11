import Container from "@/layouts/Container";
import { useTranslation } from "react-i18next";
import type { Product } from "@/types/Product";
import ProductCard from "@/components/molecules/common/ProductCard";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";

export default function RelatedProducts({ currentProduct }: { currentProduct: Product }) {
  const { t } = useTranslation("shop");
  const { relatedProducts } = useRelatedProducts(currentProduct);

  return (
    <Container>
      <div className="products">
        <h2 style={{ textAlign: "left", width: "100%" }}>{t("relatedProducts.title")}</h2>
        <div className="product-list">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </Container>
  );
}
