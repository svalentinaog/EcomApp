import { useHomeProductList } from "@/hooks/useHomeProductList";

import ProductFilter from "@/components/molecules/home/ProductFilter";
import ProductCard from "@/components/molecules/common/ProductCard";
import Container from "@/layouts/Container";
import { Link } from "react-router-dom";
import CommonButton from "@/components/atoms/CommonButton";

export default function ProductListSection() {
  const { categories, displayProducts, filter, setFilter, t, getPath } =
  useHomeProductList();

  return (
    <Container>
      <div className="products">
        <h2>{t("products.title")}</h2>

        <ProductFilter
          categories={categories}
          selected={filter}
          onSelect={setFilter}
        />

        <div className="product-list">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="product-cta">
          <CommonButton variant="primary">
            <Link to={getPath("/shop")}>{t("products.view_more")}</Link>
          </CommonButton>
        </div>
      </div>
    </Container>
  );
}
