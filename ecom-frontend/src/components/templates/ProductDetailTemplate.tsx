import { useProductDetail } from "@/hooks/useProductDetail";

import ProductCardDetail from "@/components/sections/productDetail/ProductCardDetail";
import RelatedProducts from "@/components/sections/productDetail/RelatedProducts";

export default function ProductDetailTemplate() {
  const { product } = useProductDetail();

  if (!product) return <div>Product not found</div>;

  return (
    <>
      <ProductCardDetail product={product} />
      <RelatedProducts currentProduct={product} />
    </>
  );
}
