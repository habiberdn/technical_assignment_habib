import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, User, X, Check, ChevronDown, UserPlus } from "lucide-react";
import type { Pasien } from "@/types/pasien.types.js";

interface SearchablePasienSelectProps {
  pasienList: Pasien[];
  selectedPasienId: string;
  onSelectPasien: (pasienId: string) => void;
  onOpenQuickCreate?: () => void;
  error?: string;
}

export const SearchablePasienSelect: React.FC<SearchablePasienSelectProps> = ({
  pasienList,
  selectedPasienId,
  onSelectPasien,
  onOpenQuickCreate,
  error,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPasien = useMemo(() => {
    return pasienList.find((p) => p.id === selectedPasienId);
  }, [pasienList, selectedPasienId]);

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return pasienList;
    const query = searchTerm.toLowerCase().trim();
    return pasienList.filter(
      (p) =>
        p.nama?.toLowerCase().includes(query) ||
        p.nik?.toLowerCase().includes(query) ||
        p.alamat?.toLowerCase().includes(query) ||
        p.noRekamMedis?.toLowerCase().includes(query)
    );
  }, [pasienList, searchTerm]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (pasien: Pasien) => {
    onSelectPasien(pasien.id);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectPasien("");
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {selectedPasien ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50/60 p-2.5 shadow-xs transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{selectedPasien.nama}</p>
              <p className="text-[10px] text-gray-600 font-mono truncate">
                NIK: {selectedPasien.nik} • Tgl Lahir: {selectedPasien.tanggalLahir ? new Date(selectedPasien.tanggalLahir).toLocaleDateString("id-ID") : "-"}
              </p>
              {selectedPasien.alamat && (
                <p className="text-[10px] text-gray-500 truncate">
                  Alamat: {selectedPasien.alamat}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg p-1 text-gray-400 hover:bg-emerald-100 hover:text-red-600 transition-colors shrink-0"
            title="Ganti Pasien"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Ketik nama, NIK, atau Alamat pasien untuk mencari..."
            className={`w-full rounded-xl border py-2 pl-9 pr-8 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
              error
                ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
            }`}
          />
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
        </div>
      )}

      {isOpen && !selectedPasien && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-xl ring-1 ring-black/5 animate-in fade-in duration-100">
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {filteredList.length} Pasien Ditemukan
            </span>
            {onOpenQuickCreate && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenQuickCreate();
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <UserPlus size={13} />
                + Pasien Baru
              </button>
            )}
          </div>

          {filteredList.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400 space-y-2">
              <p>Pasien tidak ditemukan dengan kata kunci &quot;{searchTerm}&quot;.</p>
              {onOpenQuickCreate && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenQuickCreate();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  <UserPlus size={14} />
                  Daftarkan Pasien Baru
                </button>
              )}
            </div>
          ) : (
            filteredList.map((p) => {
              const isSelected = p.id === selectedPasienId;
              const formattedBirth = p.tanggalLahir
                ? new Date(p.tanggalLahir).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-";

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-900 font-bold"
                      : "hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-gray-900 truncate">{p.nama}</div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      NIK: {p.nik} • Tgl Lahir: {formattedBirth}
                    </div>
                    {p.alamat && (
                      <div className="text-[10px] text-gray-400 truncate">
                        Alamat: {p.alamat}
                      </div>
                    )}
                  </div>
                  {isSelected && <Check size={14} className="text-emerald-600 shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      )}

      {error && !selectedPasien && (
        <p className="mt-1 text-[11px] text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SearchablePasienSelect;
