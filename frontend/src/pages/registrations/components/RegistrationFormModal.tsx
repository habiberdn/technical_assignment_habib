import React, { useState, useMemo } from "react";
import { X, User, Search } from "lucide-react";
import type { FormModalState } from "../types/registrationPage.types.js";
import type { Poli } from "@/types/poli.types.js";
import type { DokterItem, JenisPembayaran } from "@/types/registrasi.types.js";
import type { Pasien } from "@/types/pasien.types.js";
import { JENIS_PEMBAYARAN_OPTIONS } from "@/constants/registrasi.js";

interface RegistrationFormModalProps {
  formModal: FormModalState;
  poliList: Poli[];
  doctorList: DokterItem[];
  pasienList: Pasien[];
  submitting: boolean;
  onClose: () => void;
  onFieldChange: (field: keyof FormModalState, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegistrationFormModal: React.FC<RegistrationFormModalProps> = ({
  formModal,
  poliList,
  doctorList,
  pasienList,
  submitting,
  onClose,
  onFieldChange,
  onSubmit,
}) => {
  const [pasienSearch, setPasienSearch] = useState<string>("");

  const filteredPasienList = useMemo(() => {
    if (!pasienSearch.trim()) return pasienList;
    const query = pasienSearch.toLowerCase().trim();
    return pasienList.filter(
      (p) =>
        p.nama?.toLowerCase().includes(query) ||
        p.nik?.toLowerCase().includes(query) ||
        p.noRekamMedis?.toLowerCase().includes(query)
    );
  }, [pasienList, pasienSearch]);

  if (!formModal.isOpen) return null;

  const filteredFormDoctors = formModal.poliId
    ? doctorList.filter((d) => !d.poliId || d.poliId === formModal.poliId)
    : doctorList;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Form Pendaftaran Pasien</h2>
            <p className="text-xs text-gray-500">Pilih pasien, poli tujuan, dokter, dan penjamin pembayaran.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          {/* Select Pasien dengan Input Cari */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Pasien <span className="text-red-500">*</span>
            </label>

            {/* Input Cari Pasien */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={pasienSearch}
                onChange={(e) => setPasienSearch(e.target.value)}
                placeholder="Cari pasien (Nama, NIK, atau RM)..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
              />
            </div>

            {/* Dropdown Pasien */}
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={formModal.pasienId}
                onChange={(e) => onFieldChange("pasienId", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="">
                  -- Pilih Pasien ({filteredPasienList.length} Ditemukan) --
                </option>
                {filteredPasienList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} (RM: {p.noRekamMedis} | NIK: {p.nik})
                  </option>
                ))}
              </select>
            </div>
            {formModal.errors.pasienId && (
              <p className="text-[11px] text-red-600">{formModal.errors.pasienId}</p>
            )}
          </div>

          {/* Grid 2 Column: Poli & Dokter */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Poliklinik Tujuan <span className="text-red-500">*</span>
              </label>
              <select
                value={formModal.poliId}
                onChange={(e) => {
                  onFieldChange("poliId", e.target.value);
                  onFieldChange("dokterId", "");
                }}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="">-- Pilih Poli --</option>
                {poliList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.kode})
                  </option>
                ))}
              </select>
              {formModal.errors.poliId && <p className="mt-1 text-[11px] text-red-600">{formModal.errors.poliId}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Dokter Pemeriksa <span className="text-red-500">*</span>
              </label>
              <select
                value={formModal.dokterId}
                onChange={(e) => onFieldChange("dokterId", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="">-- Pilih Dokter --</option>
                {filteredFormDoctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>
              {formModal.errors.dokterId && <p className="mt-1 text-[11px] text-red-600">{formModal.errors.dokterId}</p>}
            </div>
          </div>

          {/* Jenis Pembayaran */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Jenis Pembayaran / Penjamin <span className="text-red-500">*</span>
            </label>
            <select
              value={formModal.jenisPembayaran}
              onChange={(e) => onFieldChange("jenisPembayaran", e.target.value as JenisPembayaran)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              {JENIS_PEMBAYARAN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Keluhan Awal */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Keluhan Awal Pasien <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formModal.keluhanAwal}
              onChange={(e) => onFieldChange("keluhanAwal", e.target.value)}
              placeholder="Contoh: Demam tinggi 3 hari, batuk berdahak..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
            {formModal.errors.keluhanAwal && <p className="mt-1 text-[11px] text-red-600">{formModal.errors.keluhanAwal}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Memproses..." : "Daftarkan Pasien"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
