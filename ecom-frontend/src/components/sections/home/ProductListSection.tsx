import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import ProductFilter from "@/components/molecules/home/ProductFilter";
import ProductCard from "@/components/molecules/common/ProductCard";
import Container from "@/layouts/Container";
import CommonButton from "@/components/atoms/CommonButton";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import EmptyState from "@/components/molecules/common/EmptyState";

// NUEVO: Importaciones de recursos
import error503 from "@/assets/images/error-503.png";
import loadingIcon from "@/assets/icons/loading-icon.png";

export default function ProductListSection() {
  const { t } = useTranslation("home");
  const { lang } = useParams();

  // NUEVO: Extraemos isErrorProducts
  const { data: products = [], isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const [filter, setFilter] = useState<string>("all");
  
  // NUEVO: Estado para el temporizador de carga
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);

  // NUEVO: Efecto que evalúa cuánto tiempo lleva cargando (10 segundos máx)
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

  // Filtramos las categorías que no tienen productos
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
    return filtered.slice(0, 4); // Mostramos solo los primeros 4 productos
  }, [products, filter]);

  // NUEVO: Evaluamos condiciones de error y carga unificadas
  const isError = isErrorProducts || isTakingTooLong;
  const isLoading = isLoadingProducts || isLoadingCategories;

  // 1. Manejo de error 503 o servidor caído
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

  // 2. Manejo del estado de carga (Spinner girando)
  if (isLoading) {
    return (
      <Container>
        <div className="loading">
          <img 
            src={loadingIcon} 
            alt="Cargando..." 
            className="w-16 h-16 animate-spin opacity-60" 
          />
        </div>
      </Container>
    );
  }

  // 3. Renderizado principal
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