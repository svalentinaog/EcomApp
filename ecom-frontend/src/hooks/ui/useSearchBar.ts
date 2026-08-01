import type { ChangeEvent, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

interface UseSearchBarProps {
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

export function useSearchBar({ onChange, onSubmit }: UseSearchBarProps) {
  const { t } = useTranslation("common");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };

  return {
    t,
    handleChange,
    handleKeyDown,
  };
}
