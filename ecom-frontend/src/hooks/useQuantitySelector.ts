export function useQuantitySelector(
  quantity: number,
  setQuantity: (qty: number) => void,
) {
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return {
    handleDecrease,
    handleIncrease,
  };
}
