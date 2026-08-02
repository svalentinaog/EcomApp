const STORAGE_URL = "http://localhost:8000/storage";

export function getProductImage(
  url?: string | null
) {
  if (!url) {
    return "/images/product-image.jpg";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${STORAGE_URL}/${url}`;
}