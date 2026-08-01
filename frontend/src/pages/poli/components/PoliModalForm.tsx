import React, { useState, useEffect, type FormEvent } from "react";
import { X, Save, Building2, Hash } from "lucide-react";
import { createPoliSchema } from "@/dtos/poli.dto.js";
import type { Poli } from "@/types/poli.types.js";
import { INITIAL_POLI_FORM_DATA, type PoliFormData } from "@/constants/poli.js";

interface PoliModalFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData: Poli | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: { kode: string; nama: string }) => void;
}

export const PoliModalForm: React.FC<PoliModalFormProps> = ({
  isOpen,
  mode,
  initialData,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PoliFormData>(INITIAL_POLI_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setErrors({});
        if (mode === "edit" && initialData) {
          setFormData({
            kode: initialData.kode || "",
            nama: initialData.nama || "",
          });
        } else {
          setFormData(INITIAL_POLI_FORM_DATA);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof PoliFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      kode: formData.kode.trim().toUpperCase(),
      nama: formData.nama.trim(),
    };

    // Client-side validation with Zod
    const validationResult = createPoliSchema.safeParse(payload);
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

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {mode === "create" ? "Tambah Poliklinik Baru" : "Edit Poliklinik"}
            </h2>
            <p className="text-xs text-gray-500">
              {mode === "create"
                ? "Isi kode dan nama poliklinik baru."
                : `Mengubah data poli '${initialData?.nama || ""}'`}
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
          {/* Kode Poli */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Kode Poliklinik <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.kode}
                onChange={(e) => handleChange("kode", e.target.value.toUpperCase())}
                placeholder="Contoh: POL-UMU, POL-GIG..."
                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs uppercase text-gray-800 placeholder:normal-case placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  errors.kode
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
                }`}
              />
            </div>
            {errors.kode && <p className="mt-1 text-[11px] text-red-600">{errors.kode}</p>}
          </div>

          {/* Nama Poli */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Nama Poliklinik <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => handleChange("nama", e.target.value)}
                placeholder="Contoh: Poli Umum, Poli Gigi..."
                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  errors.nama
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
                }`}
              />
            </div>
            {errors.nama && <p className="mt-1 text-[11px] text-red-600">{errors.nama}</p>}
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
              {submitting ? "Menyimpan..." : mode === "create" ? "Simpan Poli" : "Update Poli"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PoliModalForm;
