import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types/Product";
import CommonButton from "@/components/atoms/CommonButton";

// Función helper para extraer el texto si viene como {es, en} desde Laravel
const getLocalizedText = (field: any, currentLang: string) => {
  if (!field) return "";
  if (typeof field === "string") return field; // Si ya es texto, lo devolvemos
  return field[currentLang] || field.es || field.en || ""; // Extraemos el idioma o un fallback
};

export default function ProductCard(product: Product) {
  const { t } = useTranslation("shop");
  const navigate = useNavigate();
  // Sacamos el idioma actual de la URL (ej. "es" o "en")
  const { lang = "es" } = useParams<{ lang: string }>(); 
  const { addToCart } = useCart();

  const imageUrl = product.product_images?.[0]?.url_image 
    ? `http://localhost:8000/storage/${product.product_images[0].url_image}` 
    : "/images/product-image.jpg";

  const handleCardClick = () => {
    navigate(`/${lang}/product/${product.id}`);
  };

  const handleAddToCart = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // 👈 Pasamos el id del producto y la cantidad inicial (1)
    addToCart(product.id, 1);
  };

  // Extraemos el nombre correcto usando el helper
  const productName = getLocalizedText(product.name, lang);

  return (
    <div className="card-product" onClick={handleCardClick}>
      <div className="card-product-image-wrapper">
        <img
          className="card-product-image"
          src={imageUrl}
          alt={productName}
        />
      </div>
      <div className="card-product-content">
        <div className="card-product-info-content">
          {/* Renderizamos el texto ya extraído */}
          <p className="product-name">{productName}</p>
          <div className="price-container">
            <p className="price">${product.price}</p>
            {product.old_price && <p className="old-price">${product.old_price}</p>}
            {product.discount > 0 && (
              <p className="discount">
                {product.discount}% {t("product.discount")}
              </p>
            )}
          </div>
          <p>⭐⭐⭐⭐⭐ ({product.rating || 5})</p>
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