import CommonButton from "@/components/atoms/CommonButton";
import { useTranslation } from "react-i18next";

type Props = {
  title?: string;
  description?: string;
  buttonText?: string;
  imageSrc?: string;
  imageAlt?: string;
  onClearFilters?: () => void;
};

export default function ProductNotFound({
  title,
  description,
  buttonText,
  imageSrc = "/images/product-not-found.jpg",
  imageAlt,
  onClearFilters,
}: Props) {
  const { t } = useTranslation("common");

  const displayTitle = title ?? t("noResults.title");
  const displayDescription = description ?? t("noResults.description");
  const displayButtonText = buttonText ?? t("noResults.button");
  const displayImageAlt = imageAlt ?? t("noResults.imageAlt");

  return (
    <div className="product-not-found">
      <img 
        src={imageSrc} 
        alt={displayImageAlt} 
        className="product-not-found__image" 
      />
      <div className="product-not-found__content">
        <h3 className="product-not-found__title">{displayTitle}</h3>
        <p className="product-not-found__description">{displayDescription}</p>
      </div>
        {onClearFilters && (
          <CommonButton 
            variant="primary"
            onClick={onClearFilters}
          >
            {displayButtonText}
          </CommonButton>
        )}
    </div>
  );
}
