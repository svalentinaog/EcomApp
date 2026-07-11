import type { CartItem } from "@/contexts/CartContext";
import CartTableRow from "./CartTableRow";

interface CartTableProps {
  items: CartItem[];
  currentLang: "es" | "en";
  columns: {
    product: string;
    price: string;
    quantity: string;
    total: string;
    remove: string;
  };
  onQuantityChange: (productId: number, newQuantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartTable({
  items,
  currentLang,
  columns,
  onQuantityChange,
  onRemove,
}: CartTableProps) {
  return (
    <table className="cart-table">
      <thead>
        <tr>
          <th className="cart-table__col--product">{columns.product}</th>
          <th className="cart-table__col--price">{columns.price}</th>
          <th className="cart-table__col--quantity">{columns.quantity}</th>
          <th className="cart-table__col--total">{columns.total}</th>
          <th className="cart-table__col--remove"></th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <CartTableRow
            key={item.product.id}
            item={item}
            currentLang={currentLang}
            onQuantityChange={(newQuantity) =>
              onQuantityChange(item.product.id, newQuantity)
            }
            onRemove={() => onRemove(item.product.id)}
          />
        ))}
      </tbody>
    </table>
  );
}