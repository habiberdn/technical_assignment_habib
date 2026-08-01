import React, { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { X, UserPlus, AlertCircle } from "lucide-react";
import { pasienService } from "@/services/pasienService.js";
import { createPasienSchema } from "@/dtos/pasien.dto.js";
import type { Pasien } from "@/types/pasien.types.js";
import { JENIS_KELAMIN_OPTIONS, INITIAL_PASIEN_FORM_DATA } from "@/constants/pasien.js";

interface QuickCreatePasienModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPasien: Pasien) => void;
}

export const QuickCreatePasienModal: React.FC<QuickCreatePasienModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState(INITIAL_PASIEN_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const payload = {
      nik: formData.nik.trim(),
      nama: formData.nama.trim(),
      jenisKelamin: formData.jenisKelamin,
      tanggalLahir: formData.tanggalLahir ? new Date(formData.tanggalLahir) : new Date(0),
      noTelepon: formData.noTelepon.trim(),
      alamat: formData.alamat.trim(),
    };

    const result = createPasienSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      const created = await pasienService.createPasien(result.data);
      onSuccess(created);
      onClose();
    } catch (err: unknown) {
      console.error("[QuickCreatePasien error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Tidak dapat menambah pasien baru. Silakan periksa isian data.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Pendaftaran Pasien Baru</h3>
              <p className="text-[11px] text-gray-500">Registrasi kilat pasien baru untuk pendaftaran antrean.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {serverError && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={15} className="shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Nama Lengkap Pasien <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              placeholder="Contoh: Ahmad Yani"
              className={`w-full rounded-lg border px-3 py-2 text-xs text-gray-800 focus:outline-none ${
                errors.nama ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50/50 focus:border-emerald-600"
              }`}
            />
            {errors.nama && <p className="mt-1 text-[11px] text-red-600">{errors.nama}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                NIK (16 Digit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => handleChange("nik", e.target.value)}
                placeholder="3271012345670001"
                className={`w-full rounded-lg border px-3 py-2 text-xs font-mono text-gray-800 focus:outline-none ${
                  errors.nik ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50/50 focus:border-emerald-600"
                }`}
              />
              {errors.nik && <p className="mt-1 text-[11px] text-red-600">{errors.nik}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.jenisKelamin}
                onChange={(e) => handleChange("jenisKelamin", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
              >
                {JENIS_KELAMIN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => handleChange("tanggalLahir", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-xs text-gray-800 focus:outline-none ${
                  errors.tanggalLahir ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50/50 focus:border-emerald-600"
                }`}
              />
              {errors.tanggalLahir && <p className="mt-1 text-[11px] text-red-600">{errors.tanggalLahir}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                No. Telepon / HP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.noTelepon}
                onChange={(e) => handleChange("noTelepon", e.target.value)}
                placeholder="081234567890"
                className={`w-full rounded-lg border px-3 py-2 text-xs font-mono text-gray-800 focus:outline-none ${
                  errors.noTelepon ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50/50 focus:border-emerald-600"
                }`}
              />
              {errors.noTelepon && <p className="mt-1 text-[11px] text-red-600">{errors.noTelepon}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Alamat Domisili <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.alamat}
              onChange={(e) => handleChange("alamat", e.target.value)}
              placeholder="Jl. Merdeka No. 123, RT 01/02..."
              className={`w-full rounded-lg border p-2.5 text-xs text-gray-800 focus:outline-none ${
                errors.alamat ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50/50 focus:border-emerald-600"
              }`}
            />
            {errors.alamat && <p className="mt-1 text-[11px] text-red-600">{errors.alamat}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Simpan Pasien..." : "Simpan & Pilih Pasien"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
