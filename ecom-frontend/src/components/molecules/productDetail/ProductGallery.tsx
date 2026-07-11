import { useProductGallery } from "@/hooks/useProductGallery";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const { selectedImage, selectImage } = useProductGallery(images);

  if (!images || images.length === 0) return null;

  return (
    <div className="product-gallery">
      {/* Lista de Miniaturas */}
      <div className="product-gallery__thumbnails">
        {images.map((img, index) => (
          <div
            key={index}
            className={`product-gallery__thumbnail ${
              selectedImage === img ? "product-gallery__thumbnail--active" : ""
            }`}
            onClick={() => selectImage(img)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && selectImage(img)}
          >
            <img src={img} alt={`Vista ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Imagen Principal */}
      <div className="product-gallery__main">
        <img src={selectedImage} alt="Detalle del producto" />
      </div>
    </div>
  );
}
