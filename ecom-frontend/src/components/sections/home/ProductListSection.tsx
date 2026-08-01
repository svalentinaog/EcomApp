import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import ProductFilter from "@/components/molecules/home/ProductFilter";
import ProductCard from "@/components/molecules/common/ProductCard";
import Container from "@/layouts/Container";
import CommonButton from "@/components/atoms/CommonButton";

import { useProducts } from "@/hooks/api/useProducts";
import { useCategories } from "@/hooks/api/useCategories";
import EmptyState from "@/components/molecules/common/EmptyState";
import LoandingState from "@/components/molecules/common/LoadingState";

import error503 from "@/assets/images/error-503.png";

export default function ProductListSection() {
  const { t } = useTranslation("home");
  const { lang } = useParams();

  const { data: products = [], isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const [filter, setFilter] = useState<string>("all");
  
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>; 
    
    if (isLoadingProducts || isLoadingCategories) {
      timeout = setTimeout(() => {
        setIsTakingTooLong(true);
      }, 10000); 
    } else {
      setIsTakingTooLong(false);
    }

    return () => clearTimeout(timeout);
  }, [isLoadingProducts, isLoadingCategories]);

  const activeCategories = useMemo(() => {
    if (!products.length || !categories.length) return [];

    const categoriesInUse = new Set();
    
    products.forEach((product) => {
      if (product.subcategory?.category?.name) {
        categoriesInUse.add(product.subcategory.category.name);
      }
      if (product.subcategory?.name) {
        categoriesInUse.add(product.subcategory.name);
      }
    });

    return categories.filter((category) => categoriesInUse.has(category.name));
  }, [categories, products]);

  const displayProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (filter === "all") return true;
      return (
        product.subcategory?.category?.name === filter ||
        product.subcategory?.name === filter
      );
    });
    return filtered.slice(0, 8); 
  }, [products, filter]);

  const isError = isErrorProducts || isTakingTooLong;
  const isLoading = isLoadingProducts || isLoadingCategories;

  if (isError) {
    return (
      <Container>
        <div className="py-20">
          <EmptyState
            translationKey="error503"
            imageSrc={error503}
          />
        </div>
      </Container>
    );
  }

    if (isLoading) {
      return <LoandingState />
    }

  return (
    <Container>
      <div className="products">
        <h2>{t("products.title")}</h2>
        
        {products.length === 0 ? (
          // Manejo de base de datos vacía (emptyDb)
          <div className="py-10">
            <EmptyState 
              translationKey="emptyDb"
            />
          </div>
        ) : (
          <>
            <ProductFilter
              categories={activeCategories}
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
                <Link to={`/${lang}/shop`}>{t("products.view_more")}</Link>
              </CommonButton>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}