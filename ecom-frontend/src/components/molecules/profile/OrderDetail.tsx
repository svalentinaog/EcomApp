import type { Order } from "@/types/Order";

const paymentStatusMap: Record<string, { label: string; variant: string }> = {
  approved: { label: "Pagado", variant: "success" },
  pending: { label: "Pendiente", variant: "warning" },
  in_process: { label: "Pendiente", variant: "warning" },
  rejected: { label: "Cancelado", variant: "danger" },
};

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
}

export default function OrderDetail({ order, onBack }: OrderDetailProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const paymentInfo = paymentStatusMap[order.payment_status] ?? {
    label: order.payment_status,
    variant: "neutral",
  };

  return (
    <div className="order-detail">
      <button className="order-detail__back" onClick={onBack}>
        ← Volver a mis pedidos
      </button>

      <h2 className="order-detail__title">Detalle del Pedido</h2>
      <p className="order-detail__subtitle">
        Información completa del pedido #{order.id}.
      </p>

      <div className="order-detail__info-bar">
        <div>
          <p className="order-detail__info-label">ID Pedido</p>
          <p className="order-detail__info-value">#{order.id}</p>
        </div>
        <div>
          <p className="order-detail__info-label">Fecha del pedido</p>
          <p className="order-detail__info-value">{formattedDate}</p>
        </div>
        <div>
          <p className="order-detail__info-label">Método de pago</p>
          <p className="order-detail__info-value">{order.payment_method}</p>
        </div>
        <div>
          <p className="order-detail__info-label">Estado</p>
          <p className={`status-pill status-pill--${paymentInfo.variant}`}>
            {paymentInfo.label}
          </p>
        </div>
      </div>

      <h3>Productos</h3>
      <table className="order-detail__items-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="order-detail__product-cell">
                  <img
                    src={item.product.product_images?.[0]?.url_image}
                    alt={item.product.name}
                  />
                  <div>
                    <p className="order-detail__product-name">{item.product.name}</p>
                    <p className="order-detail__product-sku">SKU: {item.product.sku}</p>
                  </div>
                </div>
              </td>
              <td>${Number(item.unit_price).toLocaleString()}</td>
              <td>{item.quantity}</td>
              <td>${Number(item.subtotal).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-detail__boxes">
        <div className="order-detail__box">
          <h4>Resumen de pago</h4>
          <div className="order-detail__summary-row">
            <p>Subtotal</p>
            <p>${Number(order.subtotal).toLocaleString()}</p>
          </div>
          <div className="order-detail__summary-row">
            <p>Envío</p>
            <p>${Number(order.cost).toLocaleString()}</p>
          </div>
          <div className="order-detail__summary-row order-detail__summary-row--total">
            <p>Total</p>
            <p>${Number(order.total).toLocaleString()}</p>
          </div>
        </div>

        <div className="order-detail__box">
          <h4>Envío y contacto</h4>
          <p className="order-detail__box-subtitle">DIRECCIÓN DE ENVÍO</p>
          <p>{order.full_name}</p>
          <p>{order.address_line}</p>
          <p>{order.city}, {order.state}, {order.postal_code}</p>
          <p>{order.country}</p>
          <p className="order-detail__box-subtitle">CONTACTO</p>
          <p>Tel: {order.phone}</p>
        </div>
      
      </div>
    </div>
  );
}