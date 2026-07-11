import { search } from "@/assets";
import { useSearchBar } from "@/hooks/useSearchBar";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const { t, handleChange, handleKeyDown } = useSearchBar({
    onChange,
    onSubmit,
  });

  return (
    <div className="searchbar">
      <img src={search} alt="Buscar" className="searchbar__icon" />
      <input
        type="text"
        placeholder={t("header.search")}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
