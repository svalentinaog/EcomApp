import { useTranslation } from "react-i18next";
import noResults from "@/assets/images/no-results.jpg";

type Props = {
  translationKey?: "noResults" | "noPriceResults" | "emptyDb" | "error503" | "noOrders";
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  buttonText?: string;
  onClearFilters?: () => void;
};

export default function EmptyState({
  translationKey = "noResults",
  title,
  description,
  imageSrc = noResults,
  imageAlt,
}: Props) {
  const { t } = useTranslation("common");

  const displayTitle = title ?? t(`${translationKey}.title`);

  const displayDescription =
    description ?? t(`${translationKey}.description`);
    
  const displayImageAlt = imageAlt ?? t(`${translationKey}.imageAlt`);

  return (
    <div className="product-not-found">
      <img
        src={imageSrc}
        alt={displayImageAlt}
        className="product-not-found__image"
      />

      <div className="product-not-found__content">
        <h3 className="product-not-found__title">
          {displayTitle}
        </h3>

        <p className="product-not-found__description">
          {displayDescription}
        </p>
      </div>
    </div>
  );
}
