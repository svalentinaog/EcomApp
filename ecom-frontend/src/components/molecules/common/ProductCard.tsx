import type { Product } from "@/types/Product";
import CommonButton from "@/components/atoms/CommonButton";
import { useProductCard } from "@/hooks/useProductCard";

export default function ProductCard(product: Product) {
  const { t, displayName, handleCardClick, handleAddToCart } =
    useProductCard(product);

  return (
    <div className="card-product" onClick={handleCardClick}>
      <div className="card-product-image-wrapper">
        <img
          className="card-product-image"
          src={product.images[0] || "/images/product-image.jpg"}
          alt={displayName}
        />
      </div>
      <div className="card-product-content">
        <div className="card-product-info-content">
          <p className="product-name">{displayName}</p>
          <div className="price-container">
            <p className="price">${product.price}</p>
            <p className="old-price">${product.oldPrice}</p>
            <p className="discount">
              {product.discount}% {t("product.discount")}
            </p>
          </div>
          <p>⭐⭐⭐⭐⭐ ({product.rating})</p>
        </div>
        <div onClick={handleAddToCart}>
          <CommonButton variant="primary-full-width">
            {t("product.add_to_cart")}
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
