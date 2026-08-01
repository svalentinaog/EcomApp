import type { Order } from "@/hooks/useOrders";

const paymentStatusLabels: Record<string, string> = {
  pending: "Pago pendiente",
  approved: "Pago aprobado",
  rejected: "Pago rechazado",
  in_process: "Pago en proceso",
};

interface OrderCardProps {
  order: Order;
  onSelect: () => void;
}

export default function OrderCard({ order, onSelect }: OrderCardProps) {
  const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
  const formattedDate = new Date(order.created_at).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="order-card" onClick={onSelect}>
      <div className="order-card__header">
        <span className="order-card__id">Pedido #{order.id}</span>
        <span className="order-card__date">{formattedDate}</span>
      </div>

      <div className="order-card__body">
        <span className="order-card__items">
          {itemCount} {itemCount === 1 ? "producto" : "productos"}
        </span>
        <span className={`order-card__status order-card__status--${order.payment_status}`}>
          {paymentStatusLabels[order.payment_status] ?? order.payment_status}
        </span>
      </div>

      <div className="order-card__footer">
        <span className="order-card__total">${Number(order.total).toLocaleString()}</span>
        <span className="order-card__arrow">›</span>
      </div>
    </div>
  );
}