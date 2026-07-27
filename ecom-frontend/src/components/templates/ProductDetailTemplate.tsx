import { useProductDetail } from "@/hooks/useProductDetail";
import ProductCardDetail from "@/components/sections/productDetail/ProductCardDetail";
import RelatedProducts from "@/components/sections/productDetail/RelatedProducts";

export default function ProductDetailTemplate() {
  const { product, isLoading, isError } = useProductDetail();

  // 1. Mostrar estado de carga si está haciendo el fetch por primera vez
  if (isLoading) {
    return <div className="text-center py-20">Cargando detalles del producto...</div>;
  }

  // 2. Manejar errores del servidor
  if (isError) {
    return <div className="text-center py-20 text-red-500">Ocurrió un error al cargar el producto.</div>;
  }

  // 3. Manejar el caso donde no existe el producto (ej. un ID inventado)
  if (!product) {
    return <div className="text-center py-20 text-xl font-bold">Producto no encontrado</div>;
  }

  return (
    <>
      <ProductCardDetail product={product} />
      <RelatedProducts currentProduct={product} />
    </>
  );
}