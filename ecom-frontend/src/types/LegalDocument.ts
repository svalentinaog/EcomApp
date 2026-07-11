export interface TranslationMap {
  en: string;
  es: string;
}

export interface TranslationArrayMap {
  en: string[];
  es: string[];
}

export interface LegalDocument {
  slug: string;
  title: TranslationMap;
  lastUpdated: TranslationMap;
  sections: {
    subtitle: TranslationMap;
    paragraphs: TranslationArrayMap;
  }[];
}
