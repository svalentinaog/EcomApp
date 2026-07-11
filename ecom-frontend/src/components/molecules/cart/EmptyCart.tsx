import CommonButton from "@/components/atoms/CommonButton";
import { useNavigate } from "react-router-dom";
import { useCartState } from "@/hooks/useCartState";
import Container from "@/layouts/Container";
import { emptyCart } from "@/assets";

export default function EmptyCart() {
  const { t, getPath } = useCartState();
  const navigate = useNavigate();

  return (
    <Container>
      <div className="cart-state">
        <img
          className="cart-state__image"
          src={emptyCart}
          alt="Carrito vacío"
          aria-hidden="true"
        />

        <div className="cart-state__content">
          <h3>{t("cart.emptyTitle")}</h3>
          <p>{t("cart.emptyDescription")}</p>
        </div>

        <div className="cart-state__button">
          <CommonButton
            variant="primary"
            type="button"
            onClick={() => navigate(getPath("/shop"))}
          >
            {t("cart.shopButton")}
          </CommonButton>
        </div>
      </div>
    </Container>
  );
}

