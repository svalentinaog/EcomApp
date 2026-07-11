import type { Product } from "@/types/Product";
import CommonButton from "@/components/atoms/CommonButton";
import QuantitySelector from "@/components/molecules/productDetail/QuantitySelector";
import Container from "@/layouts/Container";
import ProductGallery from "@/components/molecules/productDetail/ProductGallery";
import { useProductDetailCard } from "@/hooks/useProductDetailCard";

export default function ProductCardDetail({ product }: { product: Product }) {
  const {
    t,
    currentLang,
    displayName,
    quantity,
    setQuantity,
    handleAddToCart,
  } = useProductDetailCard(product);

  return (
    <Container>
      <div className="card-product-detail">
        <ProductGallery images={product.images} />
        <div className="card-product-detail-content">
          <div className="card-product-detail-content-info">
            <h1 className="product-name">{displayName}</h1>
            <div className="product-detail-info-container">
              <div className="price-container">
                <h2 className="price">${product.price}</h2>
                <p className="old-price">${product.oldPrice}</p>
                <p className="discount">
                  {product.discount}% {t("product.discount")}
                </p>
              </div>
              <p>⭐⭐⭐⭐⭐ ({product.rating})</p>
            </div>
            <p>{product.description[currentLang]}</p>
          </div>
          <div className="card-product-detail-content-actions">
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <CommonButton variant="primary" onClick={handleAddToCart}>
              {t("product.add_to_cart")}
            </CommonButton>
          </div>
        </div>
      </div>
    </Container>
  );
}
