import type { Order } from "@/hooks/useOrders";

const paymentStatusMap: Record<string, { label: string; variant: string }> = {
  approved: { label: "Pagado", variant: "success" },
  pending: { label: "Pendiente", variant: "warning" },
  in_process: { label: "Pendiente", variant: "warning" },
  rejected: { label: "Cancelado", variant: "danger" },
};

interface OrderTableRowProps {
  order: Order;
  onSelect: () => void;
}

export default function OrderTableRow({ order, onSelect }: OrderTableRowProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const statusInfo = paymentStatusMap[order.payment_status] ?? {
    label: order.payment_status,
    variant: "neutral",
  };

  return (
    <tr className="orders-table__row">
      <td className="orders-table__col--date">{formattedDate}</td>
      <td className="orders-table__col--id">#{order.id}</td>
      <td className="orders-table__col--total">${Number(order.total).toLocaleString()}</td>
      <td className="orders-table__col--status">
        <span className={`status-pill status-pill--${statusInfo.variant}`}>
          {statusInfo.label}
        </span>
      </td>
      <td className="orders-table__col--detail">
        <button className="orders-table__detail-link" onClick={onSelect}>
          Ver Detalle
        </button>
      </td>
    </tr>
  );
}