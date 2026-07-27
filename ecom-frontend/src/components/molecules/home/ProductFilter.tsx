import type { Category } from "@/types/Category";

type Props = {
  categories: Category[];
  selected: string;
  onSelect: (cat: string) => void;
  allLabel?: string;
  className?: string;
};

export default function ProductFilter({
  categories,
  selected,
  onSelect,
  allLabel = "Todos",
}: Props) {
  return (
    <div className={`filter-home`}>
      <h4
        className={selected === "all" ? "tab-active" : ""}
        onClick={() => onSelect("all")}
      >
        {allLabel}
      </h4>

      {categories.map((cat) => (
        <h4
          key={cat.id}
          className={selected === cat.name ? "tab-active" : ""}
          onClick={() => onSelect(cat.name)}
        >
          {cat.name}
        </h4>
      ))}
    </div>
  );
}