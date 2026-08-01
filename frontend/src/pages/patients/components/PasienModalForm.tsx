import React, { useState, useEffect, type FormEvent } from "react";
import { X, Save, User, CreditCard, Phone, MapPin, Calendar } from "lucide-react";
import { createPasienSchema } from "@/dtos/pasien.dto.js";
import type { Pasien, JenisKelamin } from "@/types/pasien.types.js";
import {
  INITIAL_PASIEN_FORM_DATA,
  JENIS_KELAMIN_OPTIONS,
  type PasienFormData,
} from "@/constants/pasien.js";

interface PasienModalFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData: Pasien | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const PasienModalForm: React.FC<PasienModalFormProps> = ({
  isOpen,
  mode,
  initialData,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PasienFormData>(INITIAL_PASIEN_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setErrors({});
        if (mode === "edit" && initialData) {
          setFormData({
            nik: initialData.nik || "",
            nama: initialData.nama || "",
            jenisKelamin: initialData.jenisKelamin || "LAKI_LAKI",
            tanggalLahir: initialData.tanggalLahir
              ? new Date(initialData.tanggalLahir).toISOString().split("T")[0]
              : "",
            noTelepon: initialData.noTelepon || "",
            alamat: initialData.alamat || "",
          });
        } else {
          setFormData(INITIAL_PASIEN_FORM_DATA);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof PasienFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      nik: formData.nik.trim(),
      nama: formData.nama.trim(),
      jenisKelamin: formData.jenisKelamin,
      tanggalLahir: formData.tanggalLahir ? new Date(formData.tanggalLahir) : undefined,
      noTelepon: formData.noTelepon.trim(),
      alamat: formData.alamat.trim(),
    };

    // Client-side validation with Zod
    const validationResult = createPasienSchema.safeParse(payload);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit({
      ...payload,
      tanggalLahir: formData.tanggalLahir, // Send YYYY-MM-DD string
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {mode === "create" ? "Tambah Pasien Baru" : "Edit Data Pasien"}
            </h2>
            <p className="text-xs text-gray-500">
              {mode === "create"
                ? "Isi formulir berikut untuk mendaftarkan pasien baru."
                : `Mengubah data rekam medis ${initialData?.noRekamMedis || ""}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => handleChange("nik", e.target.value)}
                placeholder="16 digit NIK..."
                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  errors.nik
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
                }`}
              />
            </div>
            {errors.nik && <p className="mt-1 text-[11px] text-red-600">{errors.nik}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Nama Lengkap Pasien <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => handleChange("nama", e.target.value)}
                placeholder="Nama lengkap sesuai KTP..."
                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  errors.nama
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
                }`}
              />
            </div>
            {errors.nama && <p className="mt-1 text-[11px] text-red-600">{errors.nama}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.jenisKelamin}
                onChange={(e) => handleChange("jenisKelamin", e.target.value as JenisKelamin)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                {JENIS_KELAMIN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => handleChange("tanggalLahir", e.target.value)}
                  className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs text-gray-800 focus:outline-none focus:ring-2 ${
                    errors.tanggalLahir
                      ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
                  }`}
                />
              </div>
              {errors.tanggalLahir && (
                <p className="mt-1 text-[11px] text-red-600">{errors.tanggalLahir}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Nomor Telepon / HP <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.noTelepon}
                onChange={(e) => handleChange("noTelepon", e.target.value)}
                placeholder="Contoh: 081234567890"
                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  errors.noTelepon
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
                }`}
              />
            </div>
            {errors.noTelepon && <p className="mt-1 text-[11px] text-red-600">{errors.noTelepon}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                rows={3}
                value={formData.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                placeholder="Alamat domisili lengkap..."
                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  errors.alamat
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
                }`}
              />
            </div>
            {errors.alamat && <p className="mt-1 text-[11px] text-red-600">{errors.alamat}</p>}
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
              <Save size={15} />
              {submitting ? "Menyimpan..." : mode === "create" ? "Simpan Pasien" : "Update Pasien"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasienModalForm;
