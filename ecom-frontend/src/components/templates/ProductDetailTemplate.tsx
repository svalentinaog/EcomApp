import { useParams } from "react-router-dom";
import { useProductDetail } from "@/hooks/api/useProducts";
import ProductCardDetail from "@/components/sections/productDetail/ProductCardDetail";
import RelatedProducts from "@/components/sections/productDetail/RelatedProducts";
import LoandingState from "@/components/molecules/common/LoadingState";
import EmptyState from "../molecules/common/EmptyState";

export default function ProductDetailTemplate() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, isError } = useProductDetail(Number(id));

  if (isLoading) {
    return <LoandingState />
  }

  if (isError) {
    return (
      <EmptyState 
        translationKey="error503" 
        description="Ocurrió un error al cargar el producto." 
      />
    );
  }

  if (!product) {
    return <EmptyState translationKey="noResults" />;
  }

  return (
    <>
      <ProductCardDetail product={product} />
      <RelatedProducts currentProduct={product} />
    </>
  );
}