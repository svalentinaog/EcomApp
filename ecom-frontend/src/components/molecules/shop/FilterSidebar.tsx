import AccordionMenu from "../../molecules/shop/AccordionMenu";
import PriceRange from "@/components/molecules/shop/PriceRange";
import { useTranslation } from "react-i18next";
import type { Category } from "@/types/Category";

interface FilterSidebarProps {
  categories: Category[];
  selectedCat: string;
  onSelectCat: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (val: [number, number]) => void;
  priceMin: number;
  priceMax: number;
}

export default function FilterSidebar({
  categories,
  selectedCat,
  onSelectCat,
  priceRange,
  onPriceChange,
  priceMin,
  priceMax,
}: FilterSidebarProps) {
  const { t } = useTranslation("shop");

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__section">
        <h3 className="filter-title">{t("filters.categories")}</h3>
        {/* 'categories' pasa directo a AccordionMenu ya con la estructura { id, name, subcategories } */}
        <AccordionMenu
          groups={categories}
          selected={selectedCat}
          onSelect={onSelectCat}
        />
      </div>

      <div className="filter-sidebar__section">
        <h3 className="filter-title">{t("filters.prices")}</h3>
        <PriceRange
          min={priceMin}
          max={priceMax}
          value={priceRange}
          onChange={onPriceChange}
        />
      </div>
    </aside>
  );
}