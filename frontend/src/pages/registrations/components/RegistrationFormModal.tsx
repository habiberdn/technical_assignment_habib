import React, { useState } from "react";
import { X } from "lucide-react";
import type { FormModalState } from "../types/registrationPage.types.js";
import type { Poli } from "@/types/poli.types.js";
import type { DokterItem, JenisPembayaran } from "@/types/registrasi.types.js";
import type { Pasien } from "@/types/pasien.types.js";
import { JENIS_PEMBAYARAN_OPTIONS } from "@/constants/registrasi.js";
import { SearchablePasienSelect } from "./SearchablePasienSelect.js";
import { QuickCreatePasienModal } from "./QuickCreatePasienModal.js";

interface RegistrationFormModalProps {
  formModal: FormModalState;
  poliList: Poli[];
  doctorList: DokterItem[];
  pasienList: Pasien[];
  submitting: boolean;
  onClose: () => void;
  onFieldChange: (field: keyof FormModalState, value: any) => void;
  onAddNewPasien?: (newPasien: Pasien) => void;
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
  onAddNewPasien,
  onSubmit,
}) => {
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState<boolean>(false);

  if (!formModal.isOpen) return null;

  const filteredFormDoctors = formModal.poliId
    ? doctorList.filter((d) => !d.poliId || d.poliId === formModal.poliId)
    : doctorList;

  const handleQuickCreateSuccess = (newPasien: Pasien) => {
    if (onAddNewPasien) {
      onAddNewPasien(newPasien);
    }
    onFieldChange("pasienId", newPasien.id);
  };

  return (
    <>
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
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-semibold text-gray-700">
                Pasien <span className="text-red-500">*</span>
              </label>

              <SearchablePasienSelect
                pasienList={pasienList}
                selectedPasienId={formModal.pasienId}
                onSelectPasien={(id) => onFieldChange("pasienId", id)}
                onOpenQuickCreate={() => setIsQuickCreateOpen(true)}
                error={formModal.errors.pasienId}
              />
            </div>

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
                    {p.nama}
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

    <QuickCreatePasienModal
      isOpen={isQuickCreateOpen}
      onClose={() => setIsQuickCreateOpen(false)}
      onSuccess={handleQuickCreateSuccess}
    />
  </>
  );
};
