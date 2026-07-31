import React, { useState, useEffect, type FormEvent } from "react";
import { X, Save, User, CreditCard, Phone, MapPin, Calendar } from "lucide-react";
import { createPasienSchema } from "../../../dtos/pasien.dto.js";
import type { Pasien, JenisKelamin } from "../../../types/pasien.types.js";

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
  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState<JenisKelamin>("LAKI_LAKI");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === "edit" && initialData) {
        setNik(initialData.nik || "");
        setNama(initialData.nama || "");
        setJenisKelamin(initialData.jenisKelamin || "LAKI_LAKI");

        // Format date YYYY-MM-DD for date input
        if (initialData.tanggalLahir) {
          const formattedDate = new Date(initialData.tanggalLahir).toISOString().split("T")[0];
          setTanggalLahir(formattedDate);
        } else {
          setTanggalLahir("");
        }

        setNoTelepon(initialData.noTelepon || "");
        setAlamat(initialData.alamat || "");
      } else {
        setNik("");
        setNama("");
        setJenisKelamin("LAKI_LAKI");
        setTanggalLahir("");
        setNoTelepon("");
        setAlamat("");
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      nik: nik.trim(),
      nama: nama.trim(),
      jenisKelamin,
      tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
      noTelepon: noTelepon.trim(),
      alamat: alamat.trim(),
    };

    // Client-side validation with Zod
    const validationResult = createPasienSchema.safeParse(formData);
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

    // Send formatted string date to backend
    onSubmit({
      ...formData,
      tanggalLahir: tanggalLahir, // Send YYYY-MM-DD string
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* NIK */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
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

          {/* Nama Pasien */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Nama Lengkap Pasien <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
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

          {/* Grid 2 Column: Jenis Kelamin & Tanggal Lahir */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value as JenisKelamin)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
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
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
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

          {/* No Telepon */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Nomor Telepon / HP <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
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

          {/* Alamat */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                rows={3}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
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

          {/* Footer Actions */}
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
