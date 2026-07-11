type Props = {
  categories: string[];
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
          key={cat}
          className={selected === cat ? "tab-active" : ""}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </h4>
      ))}
    </div>
  );
}
