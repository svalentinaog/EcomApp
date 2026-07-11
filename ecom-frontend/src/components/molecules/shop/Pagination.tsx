import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation("shop");

  const pageItems = useMemo<(number | string)[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label={t("pagination.ariaLabel")}>      
      <button
        type="button"
        className="pagination__item pagination__item--control"
        disabled={currentPage === 1}
        aria-label={t("pagination.previous")}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {"<"}
      </button>

      {pageItems.map((item, index) => {
        const isEllipsis = item === "...";
        const pageNumber = Number(item);

        return isEllipsis ? (
          <span key={`ellipsis-${index}`} className="pagination__item pagination__item--ellipsis">
            {item}
          </span>
        ) : (
          <button
            key={pageNumber}
            type="button"
            className={`pagination__item ${pageNumber === currentPage ? "pagination__item--active" : ""}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination__item pagination__item--control"
        disabled={currentPage === totalPages}
        aria-label={t("pagination.next")}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {">"}
      </button>
    </nav>
  );
}
