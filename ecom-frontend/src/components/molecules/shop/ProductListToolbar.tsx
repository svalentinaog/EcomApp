import { useTranslation } from "react-i18next";
import CustomSelect, { type Option } from "@/components/atoms/CustomSelect";

interface ProductListToolbarProps {
  showingCount: number;
  totalCount: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  sortOption: string;
  onSortChange: (sort: string) => void;
}

export default function ProductListToolbar({
  showingCount,
  totalCount,
  pageSize,
  onPageSizeChange,
  sortOption,
  onSortChange,
}: ProductListToolbarProps) {
  const { t } = useTranslation("shop");

  // Opciones de paginación
  const pageSizeOptions: Option[] = [
    { value: 9, label: "Mostrar 9" },
    { value: 18, label: "Mostrar 18" },
    { value: 27, label: "Mostrar 27" },
  ];

  // Opciones de ordenamiento
  const sortOptions: Option[] = [
    { value: "default", label: "Orden: Relevancia" },
    { value: "price-asc", label: "Precio: Menor a Mayor" },
    { value: "price-desc", label: "Precio: Mayor a Menor" },
    { value: "name-asc", label: "Nombre: A - Z" },
    { value: "name-desc", label: "Nombre: Z - A" },
  ];

  return (
    <div className="product-toolbar">
      <div className="product-toolbar__info">
        {t("toolbar.showing", { defaultValue: "Mostrando:" })}{" "}
        <strong>{showingCount}</strong>{" "}
        {t("toolbar.of", { defaultValue: "de" })}{" "}
        <strong>
          {totalCount} {t("toolbar.products", { defaultValue: "Productos" })}
        </strong>
      </div>

      <div className="product-toolbar__controls">
        <CustomSelect
          options={pageSizeOptions}
          value={pageSize}
          onChange={onPageSizeChange}
        />

        <CustomSelect
          options={sortOptions}
          value={sortOption}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}