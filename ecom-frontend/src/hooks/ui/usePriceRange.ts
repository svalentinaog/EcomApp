import type { ChangeEvent } from "react";

interface UsePriceRangeProps {
  value: [number, number];
  onChange: (val: [number, number]) => void;
  min: number;
  max: number;
}

export function usePriceRange({ value, onChange, min, max }: UsePriceRangeProps) {
  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    onChange([value[0], newMax]);
  };

  const progress = max > min ? ((value[1] - min) / (max - min)) * 100 : 0;

  return {
    handleMaxChange,
    progress,
  };
}
