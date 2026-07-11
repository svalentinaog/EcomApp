export type TranslationMap = {
  es: string;
  en: string;
};

export type Product = {
  id: number;
  name: TranslationMap;
  description: TranslationMap;
  price: number;
  oldPrice: number;
  discount: number;
  category: TranslationMap;
  subCategory: TranslationMap;
  images: string[];
  rating: number;
};
