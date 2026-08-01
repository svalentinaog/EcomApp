import type { Order } from "@/hooks/useOrders";
import OrderTableRow from "@/components/molecules/profile/OrderTableRow";

interface OrdersTableProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export default function OrdersTable({ orders, onSelect }: OrdersTableProps) {
  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th className="orders-table__col--date">Fecha</th>
            <th className="orders-table__col--id">ID Pedido</th>
            <th className="orders-table__col--total">Total</th>
            <th className="orders-table__col--status">Pago</th>
            <th className="orders-table__col--detail"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderTableRow key={order.id} order={order} onSelect={() => onSelect(order)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}