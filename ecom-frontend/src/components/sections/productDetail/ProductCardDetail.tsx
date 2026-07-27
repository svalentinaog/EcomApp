import type { Product } from "@/types/Product";
import CommonButton from "@/components/atoms/CommonButton";
import QuantitySelector from "@/components/molecules/productDetail/QuantitySelector";
import Container from "@/layouts/Container";
import ProductGallery from "@/components/molecules/productDetail/ProductGallery";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// URL base de tu backend para archivos públicos de Laravel
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
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    // Llamamos a la mutación pasando el ID del producto y la cantidad seleccionada
    addToCart(product.id, quantity);
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
                <h2 className="price">${product.price}</h2>
                
                {product.old_price && (
                  <p className="old-price">${product.old_price}</p>
                )}
                
                {product.discount > 0 && (
                  <p className="discount">
                    {product.discount}% {t("product.discount")}
                  </p>
                )}
              </div>
              <p>⭐⭐⭐⭐⭐ ({product.rating || 0})</p>
            </div>
            
            <p>{productDescription}</p>
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