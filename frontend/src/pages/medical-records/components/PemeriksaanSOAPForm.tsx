import React, { useState, type FormEvent } from "react";
import {
  Save,
  Plus,
  Trash2,
  History,
  AlertCircle,
  Stethoscope,
  Pill,
  Building2,
  Volume2,
} from "lucide-react";
import type { RegistrasiItem } from "@/types/registrasi.types.js";
import {
  createPemeriksaanSchema,
  type CreatePemeriksaanDTO,
} from "@/dtos/pemeriksaan.dto.js";

interface PemeriksaanSOAPFormProps {
  queue: RegistrasiItem;
  submitting: boolean;
  isReadOnly?: boolean;
  onOpenHistory: (pasienId: string) => void;
  onCallQueue?: (queue: RegistrasiItem) => void;
  onSubmit: (payload: CreatePemeriksaanDTO) => void;
}

interface FormSOAPData {
  keluhanSubjective: string;
  tekananSistolik: string;
  tekananDiastolik: string;
  suhuTubuh: string;
  beratBadan: string;
  tinggiBadan: string;
  diagnosa: string;
  rencanaTerapi: string;
  tindakan: { namaTindakan: string; catatan?: string }[];
  resep: {
    namaObat: string;
    dosis: string;
    jumlah: string;
    aturanPakai: string;
  }[];
}

const initialSOAPData: FormSOAPData = {
  keluhanSubjective: "",
  tekananSistolik: "120",
  tekananDiastolik: "80",
  suhuTubuh: "36.5",
  beratBadan: "60",
  tinggiBadan: "165",
  diagnosa: "",
  rencanaTerapi: "",
  tindakan: [],
  resep: [],
};

export const PemeriksaanSOAPForm: React.FC<PemeriksaanSOAPFormProps> = ({
  queue,
  submitting,
  isReadOnly = false,
  onOpenHistory,
  onCallQueue,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormSOAPData>(() => ({
    ...initialSOAPData,
    keluhanSubjective: queue.keluhanAwal || "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isWaitingToCall = queue.status === "MENUNGGU" && queue.statusAntrean === "MENUNGGU";

  const handleChange = (field: keyof FormSOAPData, value: unknown) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Add / Remove Tindakan Medis
  const handleAddTindakan = () => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({
      ...prev,
      tindakan: [...prev.tindakan, { namaTindakan: "", catatan: "" }],
    }));
  };

  const handleRemoveTindakan = (index: number) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({
      ...prev,
      tindakan: prev.tindakan.filter((_, idx) => idx !== index),
    }));
  };

  const handleTindakanChange = (
    index: number,
    field: "namaTindakan" | "catatan",
    val: string,
  ) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => {
      const updated = [...prev.tindakan];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, tindakan: updated };
    });
  };

  // Add / Remove Resep Obat
  const handleAddResep = () => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({
      ...prev,
      resep: [
        ...prev.resep,
        {
          namaObat: "",
          dosis: "3x1",
          jumlah: "10",
          aturanPakai: "Sesudah makan",
        },
      ],
    }));
  };

  const handleRemoveResep = (index: number) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({
      ...prev,
      resep: prev.resep.filter((_, idx) => idx !== index),
    }));
  };

  const handleResepChange = (
    index: number,
    field: "namaObat" | "dosis" | "jumlah" | "aturanPakai",
    val: string,
  ) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => {
      const updated = [...prev.resep];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, resep: updated };
    });
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    if (isReadOnly || isWaitingToCall) return;
    setErrors({});

    const payloadRaw = {
      registrasiId: queue.id,
      keluhanSubjective: formData.keluhanSubjective.trim(),
      tekananSistolik: Number(formData.tekananSistolik),
      tekananDiastolik: Number(formData.tekananDiastolik),
      suhuTubuh: Number(formData.suhuTubuh),
      beratBadan: Number(formData.beratBadan),
      tinggiBadan: Number(formData.tinggiBadan),
      diagnosa: formData.diagnosa.trim(),
      rencanaTerapi: formData.rencanaTerapi.trim(),
      tindakan: formData.tindakan
        .filter((t) => t.namaTindakan.trim().length > 0)
        .map((t) => ({
          namaTindakan: t.namaTindakan.trim(),
          catatan: t.catatan?.trim() || undefined,
        })),
      resep: formData.resep
        .filter((r) => r.namaObat.trim().length > 0)
        .map((r) => ({
          namaObat: r.namaObat.trim(),
          dosis: r.dosis.trim(),
          jumlah: Number(r.jumlah) || 1,
          aturanPakai: r.aturanPakai.trim(),
        })),
    };

    // Safe Parse Zod
    const result = createPemeriksaanSchema.safeParse(payloadRaw);
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

    onSubmit(result.data);
  };

  const patientName = queue.pasien?.nama || "Pasien";
  const rawPoliName = queue.poli?.nama || "Poliklinik";
  const poliName = rawPoliName
    .replace(/\s*\(.*?\)/g, "")
    .replace(/\s*\[.*?\]/g, "")
    .trim();

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
      {/* Patient Header Banner */}
      <div className="border-b border-emerald-100 bg-linear-to-r from-emerald-600 to-teal-600 p-4 sm:p-5 text-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-tight">
                {patientName}
              </h2>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white font-mono border border-white/20">
                RM: {queue.pasien?.noRekamMedis}
              </span>
            </div>
            <div className="text-xs text-emerald-100 flex items-center gap-2.5 flex-wrap">
              <span>
                NIK:{" "}
                <strong className="font-mono text-white">
                  {queue.pasien?.nik}
                </strong>
              </span>
              <span>•</span>
              <span>
                Penjamin:{" "}
                <strong className="text-white">{queue.jenisPembayaran}</strong>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white border border-white/20 shadow-2xs">
                <Building2 size={13} className="text-emerald-200 shrink-0" />
                {poliName}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => queue.pasien?.id && onOpenHistory(queue.pasien.id)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition-all cursor-pointer shrink-0"
        >
          <History size={15} />
          Lihat Riwayat Medis
        </button>
      </div>

      {/* Main SOAP Form Body */}
      <form
        onSubmit={handleSubmitForm}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
      >
        {isReadOnly && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 shadow-2xs">
            <AlertCircle size={16} className="shrink-0 text-amber-600" />
            <span>
              Mode Monitoring Admin (Read-Only). Hanya Dokter yang bertugas yang
              dapat menginput &amp; menyimpan data pemeriksaan medis SOAP.
            </span>
          </div>
        )}

        {/* Warning Banner for Uncalled Patients (MENUNGGU) */}
        {!isReadOnly && isWaitingToCall && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-2xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">Pasien Masih Berstatus Menunggu</p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Sesuai alur pelayanan medis, pasien harus dipanggil terlebih dahulu sebelum penginputan SOAP dapat disimpan.
                </p>
              </div>
            </div>
            {onCallQueue && (
              <button
                type="button"
                onClick={() => onCallQueue(queue)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition cursor-pointer shrink-0"
              >
                <Volume2 size={15} />
                Panggil Pasien Sekarang
              </button>
            )}
          </div>
        )}

        {/* 1. S - SUBJEKTIF (Read-Only dari Pendaftaran) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-700">
                S
              </span>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Subjektif (Keluhan Utama Pendaftaran)
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600 border border-gray-200">
              Read-Only (Diinput Saat Pendaftaran)
            </span>
          </div>
          <textarea
            rows={3}
            readOnly
            disabled
            value={formData.keluhanSubjective}
            placeholder="Keluhan awal pasien dari pendaftaran..."
            className="w-full rounded-xl border border-gray-200 bg-gray-100/80 p-3 text-xs font-medium text-gray-700 cursor-not-allowed shadow-2xs focus:outline-none"
          />
        </div>

        {/* 2. O - OBJEKTIF (Vital Signs) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-xs font-bold text-emerald-700">
              O
            </span>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Objektif (Tanda-tanda Vital / Vital Signs)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-700">
                Sistolik (mmHg)
              </label>
              <input
                type="number"
                disabled={isReadOnly || isWaitingToCall}
                value={formData.tekananSistolik}
                onChange={(e) =>
                  handleChange("tekananSistolik", e.target.value)
                }
                className={`w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20 ${
                  isReadOnly || isWaitingToCall
                    ? "bg-gray-100 cursor-not-allowed text-gray-600"
                    : ""
                }`}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-700">
                Diastolik (mmHg)
              </label>
              <input
                type="number"
                disabled={isReadOnly || isWaitingToCall}
                value={formData.tekananDiastolik}
                onChange={(e) =>
                  handleChange("tekananDiastolik", e.target.value)
                }
                className={`w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20 ${
                  isReadOnly || isWaitingToCall
                    ? "bg-gray-100 cursor-not-allowed text-gray-600"
                    : ""
                }`}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-700">
                Suhu Tubuh (°C)
              </label>
              <input
                type="number"
                step="0.1"
                disabled={isReadOnly || isWaitingToCall}
                value={formData.suhuTubuh}
                onChange={(e) => handleChange("suhuTubuh", e.target.value)}
                className={`w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20 ${
                  isReadOnly || isWaitingToCall
                    ? "bg-gray-100 cursor-not-allowed text-gray-600"
                    : ""
                }`}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-700">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                step="0.5"
                disabled={isReadOnly || isWaitingToCall}
                value={formData.beratBadan}
                onChange={(e) => handleChange("beratBadan", e.target.value)}
                className={`w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20 ${
                  isReadOnly || isWaitingToCall
                    ? "bg-gray-100 cursor-not-allowed text-gray-600"
                    : ""
                }`}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-700">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                disabled={isReadOnly || isWaitingToCall}
                value={formData.tinggiBadan}
                onChange={(e) => handleChange("tinggiBadan", e.target.value)}
                className={`w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20 ${
                  isReadOnly || isWaitingToCall
                    ? "bg-gray-100 cursor-not-allowed text-gray-600"
                    : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* 3. A - ASESMEN (Diagnosa) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 text-xs font-bold text-purple-700">
              A
            </span>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Asesmen / Diagnosa Medis{" "}
              {!isReadOnly && !isWaitingToCall && <span className="text-red-500">*</span>}
            </h3>
          </div>
          <textarea
            rows={2}
            disabled={isReadOnly || isWaitingToCall}
            value={formData.diagnosa}
            onChange={(e) => handleChange("diagnosa", e.target.value)}
            placeholder="Contoh: Febris ec susp. ISPA, Hipertensi Grade 1..."
            className={`w-full rounded-xl border p-3 text-xs text-gray-800 focus:outline-none focus:ring-2 ${
              errors.diagnosa
                ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
            } ${isReadOnly || isWaitingToCall ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""}`}
          />
          {errors.diagnosa && (
            <p className="text-[11px] text-red-600 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.diagnosa}
            </p>
          )}
        </div>

        {/* 4. P - PLAN (Rencana Terapi) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-xs font-bold text-amber-700">
              P
            </span>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Plan (Rencana Terapi &amp; Penatalaksanaan){" "}
              {!isReadOnly && !isWaitingToCall && <span className="text-red-500">*</span>}
            </h3>
          </div>
          <textarea
            rows={2}
            disabled={isReadOnly || isWaitingToCall}
            value={formData.rencanaTerapi}
            onChange={(e) => handleChange("rencanaTerapi", e.target.value)}
            placeholder="Contoh: Istirahat cukup, minum air hangat 2L/hari, edukasi tanda bahaya..."
            className={`w-full rounded-xl border p-3 text-xs text-gray-800 focus:outline-none focus:ring-2 ${
              errors.rencanaTerapi
                ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 bg-gray-50/50 focus:border-emerald-600 focus:ring-emerald-600/20"
            } ${isReadOnly || isWaitingToCall ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""}`}
          />
          {errors.rencanaTerapi && (
            <p className="text-[11px] text-red-600 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.rencanaTerapi}
            </p>
          )}
        </div>

        {/* 5. TINDAKAN MEDIS & RESEP OBAT */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-2">
          {/* Tindakan Medis */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Stethoscope size={15} className="text-emerald-600" />
                Tindakan Medis (Opsional)
              </div>
              {!isReadOnly && !isWaitingToCall && (
                <button
                  type="button"
                  onClick={handleAddTindakan}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  <Plus size={13} /> Tambah Tindakan
                </button>
              )}
            </div>

            {formData.tindakan.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2 text-center">
                Belum ada tindakan medis ditambahkan.
              </p>
            ) : (
              <div className="space-y-2">
                {formData.tindakan.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 text-xs"
                  >
                    <input
                      type="text"
                      disabled={isReadOnly || isWaitingToCall}
                      value={t.namaTindakan}
                      onChange={(e) =>
                        handleTindakanChange(
                          idx,
                          "namaTindakan",
                          e.target.value,
                        )
                      }
                      placeholder="Nama tindakan (contoh: Nebulisasi)"
                      className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                    {!isReadOnly && !isWaitingToCall && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTindakan(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resep Obat */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Pill size={15} className="text-emerald-600" />
                Resep Obat (Prescription)
              </div>
              {!isReadOnly && !isWaitingToCall && (
                <button
                  type="button"
                  onClick={handleAddResep}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  <Plus size={13} /> Tambah Obat
                </button>
              )}
            </div>

            {formData.resep.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2 text-center">
                Belum ada resep obat ditambahkan.
              </p>
            ) : (
              <div className="space-y-2">
                {/* Header Table */}
                <div className="grid grid-cols-12 gap-1.5 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="col-span-5">Nama Obat</span>
                  <span className="col-span-3">Dosis</span>
                  <span className="col-span-3">Jumlah</span>
                  {!isReadOnly && !isWaitingToCall && <span className="col-span-1 text-center">Aksi</span>}
                </div>
                {formData.resep.map((r, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-1.5 rounded-lg border border-gray-200 bg-white p-2 text-xs"
                  >
                    <input
                      type="text"
                      disabled={isReadOnly || isWaitingToCall}
                      value={r.namaObat}
                      onChange={(e) =>
                        handleResepChange(idx, "namaObat", e.target.value)
                      }
                      placeholder="Nama obat (Paracetamol)"
                      className="col-span-5 rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      disabled={isReadOnly || isWaitingToCall}
                      value={r.dosis}
                      onChange={(e) =>
                        handleResepChange(idx, "dosis", e.target.value)
                      }
                      placeholder="Dosis (3x1)"
                      className="col-span-3 rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                    <input
                      type="number"
                      disabled={isReadOnly || isWaitingToCall}
                      value={r.jumlah}
                      onChange={(e) =>
                        handleResepChange(idx, "jumlah", e.target.value)
                      }
                      placeholder="Jml"
                      className="col-span-3 rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                    {!isReadOnly && !isWaitingToCall && (
                      <button
                        type="button"
                        onClick={() => handleRemoveResep(idx)}
                        className="col-span-1 text-red-500 hover:text-red-700 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Footer */}
        {!isReadOnly && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={submitting || isWaitingToCall}
              title={isWaitingToCall ? "Pasien harus dipanggil terlebih dahulu sebelum menyimpan SOAP" : "Simpan & Selesaikan Pemeriksaan"}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Save size={16} />
              {submitting
                ? "Menyimpan SOAP..."
                : isWaitingToCall
                ? "Panggil Pasien Dahulu Untuk Simpan"
                : "Simpan & Selesaikan Pemeriksaan"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
