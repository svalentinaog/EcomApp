import { useQuantitySelector } from "@/hooks/useQuantitySelector";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (qty: number) => void;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
}: QuantitySelectorProps) {
  const { handleDecrease, handleIncrease } = useQuantitySelector(
    quantity,
    setQuantity,
  );

  return (
    <div className="quantity-selector">
      <button
        type="button"
        className="quantity-selector__button"
        onClick={handleDecrease}
        aria-label="Disminuir cantidad"
      >
        -
      </button>
      <p className="quantity-selector__value">{quantity}</p>
      <button
        type="button"
        className="quantity-selector__button"
        onClick={handleIncrease}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
