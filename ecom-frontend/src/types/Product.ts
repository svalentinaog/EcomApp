export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  discount: number;
  rating: number;
  sku: string;
  stock: number;
  subcategory_id: number;
  subcategory?: {
    id: number;
    name: string;
    category?: {
      id: number;
      name: string;
    }
  };
  product_images: {
    id: number;
    url_image: string;
  }[];
}
