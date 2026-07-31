import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "../../../types/pasien.types.js";

interface PasienPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const PasienPagination: React.FC<PasienPaginationProps> = ({ meta, onPageChange }) => {
  const { page, totalPages, total, limit } = meta;

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 pt-2 text-xs text-gray-500">
      <div>
        Menampilkan <span className="font-semibold text-gray-800">{start}</span>–
        <span className="font-semibold text-gray-800">{end}</span> dari{" "}
        <span className="font-semibold text-gray-800">{total}</span> pasien
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft size={14} />
          Sebelumnya
        </button>

        <span className="px-2 font-semibold text-gray-700">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          Berikutnya
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default PasienPagination;
