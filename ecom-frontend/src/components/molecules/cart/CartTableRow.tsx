import type { CartItem } from "@/hooks/useCart";

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
  
  // Tipados seguros para propiedades externas o dinámicas
  // Extrae la primera imagen de product_images usando url_image
  const productImages = (item.product as { product_images?: { url_image: string }[] }).product_images;
  const firstImageUrl = productImages?.[0]?.url_image;
  const productName = (item.product.name as unknown) as Record<string, string>;

  return (
    <tr className="cart-item">
      <td className="cart-item-product">
        <img
          src={firstImageUrl ? `http://localhost:8000/storage/${firstImageUrl}` : "/images/product-image.jpg"}
          alt={productName[currentLang] || "Producto"}
        />
        <p>{productName[currentLang]}</p>
        <p>{item.product.name}</p>
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