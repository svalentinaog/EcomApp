import { shoppingCartDivision } from "@/assets";

export default function CartDivider() {
  return (
    <div className="cart-divider">
      <div className="cart-divider-line"></div>
      <img src={shoppingCartDivision} alt="cart separator" className="cart-divider-icon" />
      <div className="cart-divider-line"></div>
    </div>
  );
}
