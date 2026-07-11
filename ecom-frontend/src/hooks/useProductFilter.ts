import { useState, useMemo } from "react";
import type { Product } from "@/types/Product";
import productsData from "@/data/products.json";

export function useProductFilter(
    currentLang: "es" | "en",
    searchTerm: string = "",
    category: string = "all",
    priceRange: [number, number] = [0, 25000]
  ) {
  const [products] = useState<Product[]>(productsData);

  // Límites dinámicos de precio
  const priceLimits = useMemo(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map((p) => p.price));
      return { min: 0, max };
    }
    return { min: 0, max: 25000 };
  }, [products]);



  // 1. Agrupación Jerárquica: Categoría > Subcategorías
  const categoryGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    products.forEach((p) => {
      const main = p.category[currentLang];
      const sub = p.subCategory[currentLang];
      if (!groups[main]) groups[main] = new Set();
      groups[main].add(sub);
    });

    return Object.entries(groups).map(([name, subs]) => ({
      name,
      subcategories: Array.from(subs),
    }));
  }, [products, currentLang]);

  // 2. Filtro Combinado: Categoría (Padre o Hijo) + Rango de Precio + Busqueda
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        category === "all" ||
        p.category[currentLang] === category ||
        p.subCategory[currentLang] === category;

      const matchesPrice =
        p.price >= priceRange[0] && p.price <= priceRange[1];

      const matchesSearch =
        searchTerm.trim() === "" ||
        p.name[currentLang].toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description[currentLang].toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCat && matchesPrice && matchesSearch;
    });
  }, [products, category, priceRange, currentLang, searchTerm]);

  const selectedCategoryInfo = useMemo(() => {
    if (category === "all") {
      return null;
    }
    
    let parentCategory: string | null = null;
    let isSubcategory = false;
    
    // Check if it's a parent category
    const parentGroup = categoryGroups.find(g => g.name === category);
    if (parentGroup) {
      parentCategory = category;
    } else {
        // Check if it's a subcategory, find its parent
        for (const group of categoryGroups) {
          if (group.subcategories.includes(category)) {
            parentCategory = group.name;
            isSubcategory = true;
            break;
          }
        }
      }
    
    return {
      parentCategory,
      isSubcategory,
      selectedCategory: category
    };
  }, [category, categoryGroups]);

  return {
    filteredProducts,
    categoryGroups,
    priceLimits,
    selectedCategoryInfo
  };
}
