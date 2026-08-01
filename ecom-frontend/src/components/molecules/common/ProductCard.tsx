import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/hooks/api/useCart";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "@/types/Product";
import CommonButton from "@/components/atoms/CommonButton";
import { AddCartIcon, CheckIcon } from "@/components/atoms/icons/Icons";

const getLocalizedText = (field: any, currentLang: string) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[currentLang] || field.es || field.en || "";
};

export default function ProductCard(product: Product) {
  const navigate = useNavigate();
  const { lang = "es" } = useParams<{ lang: string }>(); 
  const { t } = useTranslation("shop");
  
  const { addToCart, cartItems = [] } = useCart();
  const token = useAuthStore((state) => state.token);

  const imageUrl = product.product_images?.[0]?.url_image 
    ? `http://localhost:8000/storage/${product.product_images[0].url_image}` 
    : "/images/product-image.jpg";

  const handleCardClick = () => {
    navigate(`/${lang}/product/${product.id}`);
  };

  // 1. SOLUCIÓN AL POSIBLE ERROR DE TIPOS: Convertimos ambos a Number por seguridad
  const isAdded = cartItems.some((item) => Number(item.product_id) === Number(product.id));

  const handleAddToCart = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Evita que se dispare el clic de la tarjeta (que te lleva al detalle)
    
    console.log("🛒 Intentando añadir producto ID:", product.id);
    console.log("📦 Estado actual del carrito antes de añadir:", cartItems);

    if (!token) {
      toast.error(t("product.login_required", "Debes iniciar sesión para añadir productos a tu carrito."));
      navigate(`/${lang}/login`, { state: { from: `/${lang}/product/${product.id}` } });
      return;
    }
    
    if (!isAdded) {
      addToCart(product.id, 1);
    } else {
      console.log("⚠️ El producto ya está en el carrito, se ignoró el clic.");
    }
  };

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
        
        <div onClick={handleAddToCart} style={{ width: "100%" }}>
          {isAdded ? (
            <CommonButton variant="success-full-width">
              {t("product.added_to_cart")}
              <CheckIcon />
            </CommonButton>
          ) : (
            <CommonButton variant="primary-full-width">
              <AddCartIcon />
              {t("product.add_to_cart")}
            </CommonButton>
          )}
        </div>
      </div>
    </div>
  );
}