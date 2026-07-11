import React from "react";
import { usePriceRange } from "@/hooks/usePriceRange";

interface PriceRangeProps {
  value: [number, number];
  onChange: (val: [number, number]) => void;
  min: number;
  max: number;
}

export default function PriceRange({
  value,
  onChange,
  min,
  max,
}: PriceRangeProps) {
  const { handleMaxChange, progress } = usePriceRange({
    value,
    onChange,
    min,
    max,
  });

  return (
    <div className="price-range">
      <div className="price-range__slider-container">
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          className="price-range__slider"
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        />
      </div>
      <div className="price-range__label">
        <span>
          ${value[0]} - ${value[1]}
        </span>
      </div>
    </div>
  );
}
