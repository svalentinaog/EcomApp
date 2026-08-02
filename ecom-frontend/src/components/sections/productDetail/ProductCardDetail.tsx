import type { Product } from "@/types/Product";
import CommonButton from "@/components/atoms/CommonButton";
import QuantitySelector from "@/components/molecules/productDetail/QuantitySelector";
import Container from "@/layouts/Container";
import ProductGallery from "@/components/molecules/productDetail/ProductGallery";
import { useCart } from "@/hooks/api/useCart";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddCartIcon, CheckIcon } from "@/components/atoms/icons/Icons";

import { useNavigate, useParams } from "react-router-dom"; 
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { formatCurrency } from "@/utils/formatCurrency";

// URL base del backend para archivos públicos de Laravel
const STORAGE_URL = "http://localhost:8000/storage";

// Helper para textos traducidos si vienen en formato objeto desde Laravel
const getLocalizedText = (field: any, currentLang: string) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[currentLang] || field.es || field.en || "";
};

export default function ProductCardDetail({ product }: { product: Product }) {
  const { t } = useTranslation("shop");
  const { lang = "es" } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const { addToCart, updateQuantity, cartItems = [] } = useCart();

  // Buscamos si este producto ya existe en el carrito
  const existingCartItem = useMemo(
    () => cartItems.find((item) => Number(item.product_id) === Number(product.id)),
    [cartItems, product.id]
  );

  const isAdded = Boolean(existingCartItem);

  // La cantidad local arranca en 1, pero si el producto ya está en el carrito, la sincronizamos con lo que el usuario ya tenía guardado.
  const [quantity, setQuantity] = useState<number>(existingCartItem?.quantity ?? 1);

  // Si cartItems llega después (fetch asíncrono) o cambia en otra pestaña/tab, actualizamos la cantidad mostrada para que no se quede en "1" por defecto.
  useEffect(() => {
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
    }
  }, [existingCartItem?.quantity]);

  // La cantidad mostrada difiere de la ya guardada -> el usuario está pidiendo un cambio, no solo viendo el estado actual.
  const hasPendingChange = isAdded && quantity !== existingCartItem?.quantity;

  const handleAddToCart = () => {
     if (!token) {
      toast.error(t("product.login_required", "Debes iniciar sesión para añadir productos a tu carrito."));
      navigate(`/${lang}/login`, { state: { from: `/${lang}/product/${product.id}` } });
      return;
    }

    if (isAdded && existingCartItem) {
      updateQuantity(existingCartItem.id, quantity); 
    } else {
      addToCart(product.id, quantity);
    }
  };

  // Formateamos cada imagen construyendo la URL completa hacia Laravel
  const imageUrls =
    product.product_images?.map((img) => {
      if (img.url_image.startsWith("http")) {
        return img.url_image;
      }
      return `${STORAGE_URL}/${img.url_image}`;
    }) || [];

  const productName = getLocalizedText(product.name, lang);
  const productDescription = getLocalizedText(product.description, lang);

  return (
    <Container>
      <div className="card-product-detail">
        <ProductGallery images={imageUrls} />

        <div className="card-product-detail-content">
          <div className="card-product-detail-content-info">
            <h1 className="product-name">{productName}</h1>

            <div className="product-detail-info-container">
              <div className="price-container">
                <h2 className="price">{formatCurrency(product.price)}</h2>

                {product.old_price && (
                  <p className="old-price">{formatCurrency(product.old_price)}</p>
                )}

                {product.discount > 0 && (
                  <p className="discount">
                    {product.discount}% {t("product.discount")}
                  </p>
                )}
              </div>
              <p>⭐⭐⭐⭐⭐ ({product.rating || 0})</p>
            </div>
            
            <div className="product-detail-info-container">
               <small
                className={`status-pill ${
                  product.stock > 10
                    ? "status-pill--success"
                    : product.stock > 0
                    ? "status-pill--warning"
                    : "status-pill--danger"
                }`}
              >
                {product.stock} disponibles
              </small>
              <small
                className="status-pill status-pill--neutral"
              >
                SKU {product.sku}
              </small>
            </div>
              

            <p>{productDescription}</p>

            {isAdded && !hasPendingChange && (
              <p className="already-in-cart-hint">
                {t("product.already_in_cart", "Ya tienes {{count}} en el carrito", {
                  count: existingCartItem?.quantity,
                })}
              </p>
            )}
          </div>

          <div className="card-product-detail-content-actions">
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            
            <CommonButton
              variant={isAdded && !hasPendingChange ? "success" : "primary"}
              onClick={handleAddToCart}
              disabled={isAdded && !hasPendingChange}
            >
              {hasPendingChange ? (
                <>
                  <AddCartIcon />
                  {t("product.update_cart")}
                </>
              ) : isAdded ? (
                <>
                  {t("product.added_to_cart")}
                  <CheckIcon />
                </>
              ) : (
                <>
                  <AddCartIcon />
                  {t("product.add_to_cart")}
                </>
              )}
            </CommonButton>
          </div>
        </div>
      </div>
    </Container>
  );
}