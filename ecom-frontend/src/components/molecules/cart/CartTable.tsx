import type { CartItem } from "@/types/Cart";
import CartTableRow from "./CartTableRow";

interface CartTableProps {
  items: CartItem[];
  currentLang: string; 
  columns: {
    product: string;
    price: string;
    quantity: string;
    total: string;
    remove: string;
  };
  onQuantityChange: (cartId: number, newQuantity: number) => void;
  onRemove: (cartId: number) => void;
}

export default function CartTable({
  items,
  currentLang,
  columns,
  onQuantityChange,
  onRemove,
}: CartTableProps) {
  return (
    <div className="cart-table-container">
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
              key={item.id} 
              item={item}
              currentLang={currentLang as "es" | "en"} 
              onQuantityChange={(newQuantity) =>
                onQuantityChange(item.id, newQuantity)
              }
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}