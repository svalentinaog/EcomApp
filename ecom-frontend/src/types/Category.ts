export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  subcategories: Subcategory[];
}

export interface CategoryApiResponse {
  success: boolean;
  message: string;
  data: Category[];
}