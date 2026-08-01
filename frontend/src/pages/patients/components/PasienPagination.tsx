import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { PaginationMeta } from "@/types/pasien.types.js";

interface PasienPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export const PasienPagination: React.FC<PasienPaginationProps> = ({
  meta,
  onPageChange,
  onLimitChange,
}) => {
  const { page, totalPages, total, limit } = meta;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-3 text-xs text-gray-600 border-t border-gray-100 mt-2">
      {/* Left side: Item count & Limit Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          Menampilkan <span className="font-semibold text-gray-900">{start}</span>–
          <span className="font-semibold text-gray-900">{end}</span> dari{" "}
          <span className="font-semibold text-gray-900">{total}</span> pasien
        </div>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
            <span className="text-gray-500">Tampilkan:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Right side: Page Navigation */}
      {totalPages > 0 && (
        <div className="flex flex-wrap items-center gap-1 justify-center sm:justify-end">
          {/* First Page Button */}
          <button
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            title="Halaman Pertama"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft size={14} />
          </button>

          {/* Previous Page Button */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            title="Halaman Sebelumnya"
            className="inline-flex h-8 px-2 items-center gap-1 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 overflow-x-auto px-1">
            {getPageNumbers().map((p, idx) =>
              typeof p === "number" ? (
                <button
                  key={idx}
                  onClick={() => onPageChange(p)}
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    p === page
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-xs"
                  }`}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="px-1 text-gray-400 font-semibold select-none shrink-0">
                  ...
                </span>
              )
            )}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            title="Halaman Berikutnya"
            className="inline-flex h-8 px-2 items-center gap-1 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight size={14} />
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            title="Halaman Terakhir"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PasienPagination;
