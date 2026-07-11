import CommonButton from "@/components/atoms/CommonButton";

interface CartSummaryProps {
  subtotal: number;
  total: number;
  quantityProducts: number;
  labels: {
    title: string;
    quantityProducts: string;
    subtotal: string;
    shipping: string;
    shippingFree: string;
    total: string;
    checkoutButton: string;
  };
}

export default function CartSummary({
  subtotal,
  total,
  quantityProducts,
  labels,
}: CartSummaryProps) {
  return (
    <div className="cart-summary">
      <div className="cart-summary-header">
        <h5>{labels.title}</h5>
      </div>

      <table className="cart-summary-table">
        <tbody>
          <tr className="cart-summary-row">
            <td>{labels.quantityProducts}</td>
            <td>{quantityProducts}</td>
          </tr>

          <tr className="cart-summary-row">
            <td>{labels.subtotal}</td>
            <td>${subtotal.toLocaleString()}</td>
          </tr>

          <tr className="cart-summary-row">
            <td>{labels.shipping}</td>
            <td>{labels.shippingFree}</td>
          </tr>

          <tr className="cart-summary-row cart-summary-row--total">
            <td><h4>{labels.total}</h4> </td>
            <td><h4>${total.toLocaleString()}</h4></td>
          </tr>
        </tbody>
      </table>

      <CommonButton variant="primary">{labels.checkoutButton}</CommonButton>
    </div>
  );
}