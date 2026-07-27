import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import ProductCard from "@/components/molecules/common/ProductCard";
import EmptyState from "@/components/molecules/common/EmptyState";
import Container from "@/layouts/Container";
import FilterSidebar from "@/components/molecules/shop/FilterSidebar";
import Pagination from "@/components/molecules/shop/Pagination";
import ProductListToolbar from "@/components/molecules/shop/ProductListToolbar";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useTranslation } from "react-i18next";

import error503 from "@/assets/images/error-503.png";
import loadingIcon from "@/assets/icons/loading-icon.png";

export default function ProductListSection() {
  const { t } = useTranslation("shop");
  const { lang } = useParams(); 
  const navigate = useNavigate(); 

  const { data: products = [], isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [page, setPage] = useState(1);
  
  // NUEVO: Estados para dinámicas del toolbar
  const [pageSize, setPageSize] = useState<number>(9);
  const [sortOption, setSortOption] = useState<string>("default");

  const topListRef = useRef<HTMLDivElement>(null);
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);

  // Ocultar las categorías vacías
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

    return categories.filter((cat) => categoriesInUse.has(cat.name));
  }, [categories, products]);

  useEffect(() => {
    setPage(1);
  }, [category, priceRange, searchQuery, pageSize, sortOption]);

  useEffect(() => {
    if (topListRef.current) {
      topListRef.current.scrollIntoView({ block: "start" });
    }
  }, [page]);

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

  // 1. Filtrar los productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "all" ||
        product.subcategory?.category?.name === category ||
        product.subcategory?.name === category;

      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesSearch = 
        searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [products, category, priceRange, searchQuery]);

  // 2. NUEVO: Ordenar los productos filtrados
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [filteredProducts, sortOption]);
  
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));

  // 3. Paginar los productos ordenados
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedProducts.slice(startIndex, startIndex + pageSize);
  }, [sortedProducts, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleClearAllFilters = () => {
    setCategory("all");
    setPriceRange([0, 25000]);
    setSortOption("default");
    navigate(`/${lang}/shop`);
  };

  const isError = isErrorProducts || isTakingTooLong;
  const isLoading = isLoadingProducts || isLoadingCategories;

  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasPriceFilter = priceRange[0] !== 0 || priceRange[1] !== 25000;

  const emptyStateKey: "noResults" | "noPriceResults" = 
    hasPriceFilter && !hasSearchQuery 
      ? "noPriceResults" 
      : "noResults";

  if (isError) {
    return (
      <Container>
        <div className="py-20">
          <EmptyState translationKey="error503" imageSrc={error503} />
        </div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <div className="loading">
          <img 
            src={loadingIcon} 
            alt={t("loading")} 
            className="w-16 h-16 animate-spin opacity-60" 
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {products.length === 0 ? (
        <div className="py-20">
          <EmptyState translationKey="emptyDb" />
        </div>
      ) : (
        <div className="shop-content" ref={topListRef}>
          {isFilterOpen && (
            <div
              className="filter-overlay"
              onClick={() => setIsFilterOpen(false)}
            />
          )}
          <div className={`filter-sidebar-wrapper ${isFilterOpen ? "open" : ""}`}>
            <div className="filter-sidebar-header">
              <h3>{t("filters.categories")}</h3>
              <button
                className="close-filter-btn"
                onClick={() => setIsFilterOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <FilterSidebar
              categories={activeCategories}
              selectedCat={category}
              onSelectCat={(cat) => setCategory(cat)}
              priceRange={priceRange}
              onPriceChange={(range) => setPriceRange(range)}
              priceMin={0}
              priceMax={25000}
            />
          </div>

          <div className="products-shop">
            <div className="current-category">
              <h3>{category === "all" ? t("products") : category}</h3>
              <button
                className="clear-filters"
                onClick={handleClearAllFilters}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 24C15.35 24 18.1875 22.8375 20.5125 20.5125C22.8375 18.1875 24 15.35 24 12C24 8.65 22.8375 5.8125 20.5125 3.4875C18.1875 1.1625 15.35 0 12 0C10.275 0 8.625 0.35625 7.05 1.06875C5.475 1.78125 4.125 2.8 3 4.125V0H-9.53674e-07V10.5H10.5V7.5H4.2C5 6.1 6.09375 5 7.48125 4.2C8.86875 3.4 10.375 3 12 3C14.5 3 16.625 3.875 18.375 5.625C20.125 7.375 21 9.5 21 12C21 14.5 20.125 16.625 18.375 18.375C16.625 20.125 14.5 21 12 21C10.075 21 8.3375 20.45 6.7875 19.35C5.2375 18.25 4.15 16.8 3.525 15H0.374999C1.075 17.65 2.5 19.8125 4.65 21.4875C6.8 23.1625 9.25 24 12 24Z" fill="currentColor" />
                </svg>
              </button>
              <button
                className="mobile-filter-btn"
                onClick={() => setIsFilterOpen(true)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 5H21M7 12H17M10 19H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("filters.categories")}
              </button>
            </div>

            {/* INTEGRACIÓN DEL COMPONENTE TOOLBAR */}
            {filteredProducts.length > 0 && (
              <ProductListToolbar
                showingCount={paginatedProducts.length}
                totalCount={filteredProducts.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            )}
            
            {filteredProducts.length > 0 ? (
              <>
                <div className="product-list-shop">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <EmptyState translationKey={emptyStateKey} />
            )}
          </div>
        </div>
      )}
    </Container>
  );
}