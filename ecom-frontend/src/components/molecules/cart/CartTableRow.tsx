import type { CartItem } from "@/contexts/CartContext";

interface CartTableRowProps {
  item: CartItem;
  currentLang: "es" | "en";
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartTableRow({
  item,
  currentLang,
  onQuantityChange,
  onRemove,
}: CartTableRowProps) {
  const totalItem = item.product.price * item.quantity;

  return (
    <tr className="cart-item">
      <td className="cart-item-product">
        <img
          src={item.product.images[0] || "/images/product-image.jpg"}
          alt={item.product.name[currentLang]}
        />
        <p>{item.product.name[currentLang]}</p>
      </td>

      <td className="cart-item-price">
        ${item.product.price.toLocaleString()}
      </td>

      <td className="cart-item-quantity">
        <div className="quantity-controls">
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <p>{item.quantity}</p>
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </td>

      <td className="cart-item-total">${totalItem.toLocaleString()}</td>

      <td className="cart-item-remove-cell">
        <button
          type="button"
          className="cart-item-remove"
          onClick={onRemove}
          aria-label="Remove from cart"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}