import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/icons/Icons";

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
  const siblingCount = 1; // páginas vecinas a mostrar a cada lado de la actual
  const boundaryCount = 1; // páginas fijas al inicio y al final (1 y última)

  const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3; // vecinos + extremos + actual + 2 posibles "..."

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, boundaryCount + 2);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1);

  const showLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - boundaryCount - 1;

  const pages: (number | string)[] = [1];

  if (showLeftEllipsis) {
    pages.push("...");
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) pages.push(i);
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("...");
  } else {
    for (let i = rightSiblingIndex + 1; i < totalPages; i++) pages.push(i);
  }

  pages.push(totalPages);

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
        <ChevronLeftIcon className="" />
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
        <ChevronRightIcon className="" />
      </button>
    </nav>
  );
}