import React, { useState } from "react";
import {
  X,
  User,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Copy,
  Check,
  Stethoscope,
  Clock,
  Building2,
  FileText,
  MessageCircle,
} from "lucide-react";
import type { Pasien } from "@/types/pasien.types.js";

interface PasienDetailModalProps {
  isOpen: boolean;
  pasien: Pasien | null;
  loading?: boolean;
  onClose: () => void;
  onEdit?: (pasien: Pasien) => void;
}

export const PasienDetailModal: React.FC<PasienDetailModalProps> = ({
  isOpen,
  pasien,
  loading = false,
  onClose,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pasien) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const calculateAge = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const birth = new Date(dateStr);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const monthDiff = now.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
      }
      return age >= 0 ? `${age} Tahun` : null;
    } catch {
      return null;
    }
  };

  const handleCopyRM = () => {
    if (pasien.noRekamMedis) {
      navigator.clipboard.writeText(pasien.noRekamMedis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const initials =
    pasien.nama
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "P";

  const ageText = calculateAge(pasien.tanggalLahir);
  const formattedPhone = pasien.noTelepon?.replace(/[^0-9]/g, "") || "";
  const waNumber = formattedPhone.startsWith("0") ? `62${formattedPhone.slice(1)}` : formattedPhone;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 p-1.5 text-emerald-700">
                <FileText size={18} />
              </span>
              <h2 className="text-lg font-bold text-gray-900">Detail Pasien</h2>
              <button
                onClick={handleCopyRM}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                title="Salin No Rekam Medis"
              >
                <span>{pasien.noRekamMedis}</span>
                {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Profil rekam medis dan histori pendaftaran pasien terdaftar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-5 pr-1 text-xs">
          {/* Top Profile Summary Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
                pasien.jenisKelamin === "LAKI_LAKI"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                  : "bg-pink-100 text-pink-700 border-2 border-pink-200"
              }`}
            >
              {initials}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base font-bold text-gray-900">{pasien.nama}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    pasien.jenisKelamin === "LAKI_LAKI"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-pink-50 text-pink-700 border border-pink-200"
                  }`}
                >
                  {pasien.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>

              <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1 font-mono">
                <CreditCard size={13} className="text-gray-400" />
                NIK: {pasien.nik}
              </p>

              <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                {waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    <MessageCircle size={13} />
                    WhatsApp
                  </a>
                )}
                {pasien.noTelepon && (
                  <a
                    href={`tel:${pasien.noTelepon}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
                  >
                    <Phone size={13} className="text-gray-500" />
                    Hubungi ({pasien.noTelepon})
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Card 1: Data Pribadi */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
              <h4 className="font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200/60 pb-2">
                <User size={14} className="text-emerald-600" />
                Informasi Demografi
              </h4>

              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 block text-[11px]">NIK Pasien</span>
                  <span className="font-semibold text-gray-800 font-mono">{pasien.nik}</span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[11px]">Tanggal Lahir & Usia</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    {formatDate(pasien.tanggalLahir)}
                    {ageText && (
                      <span className="rounded-md bg-gray-200/70 px-1.5 py-0.5 text-[10px] text-gray-700">
                        {ageText}
                      </span>
                    )}
                  </span>
                </div>

                {pasien.createdAt && (
                  <div>
                    <span className="text-gray-400 block text-[11px]">Terdaftar Pada</span>
                    <span className="font-medium text-gray-700">
                      {formatDate(pasien.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Kontak & Alamat */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
              <h4 className="font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200/60 pb-2">
                <MapPin size={14} className="text-emerald-600" />
                Kontak & Domisili
              </h4>

              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 block text-[11px]">Nomor Telepon</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Phone size={13} className="text-gray-400" />
                    {pasien.noTelepon || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[11px]">Alamat Lengkap</span>
                  <p className="font-medium text-gray-800 leading-relaxed bg-white p-2 rounded-lg border border-gray-200/50 mt-1">
                    {pasien.alamat || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit / Registration History Section */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                <Stethoscope size={15} className="text-emerald-600" />
                Riwayat Pendaftaran & Kunjungan
              </h4>
              {pasien.registrasi && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  {pasien.registrasi.length} Kunjungan
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-6 text-gray-400 gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                <span>Memuat riwayat kunjungan...</span>
              </div>
            ) : !pasien.registrasi || pasien.registrasi.length === 0 ? (
              <div className="py-6 text-center text-gray-400 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                <Clock size={24} className="mx-auto mb-1.5 text-gray-300" />
                <p className="font-medium">Belum ada riwayat pendaftaran/kunjungan.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pasien.registrasi.map((reg) => {
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case "SELESAI":
                        return "bg-emerald-50 text-emerald-700 border-emerald-200";
                      case "PEMERIKSAAN":
                        return "bg-blue-50 text-blue-700 border-blue-200";
                      case "CHECK_IN":
                        return "bg-purple-50 text-purple-700 border-purple-200";
                      default:
                        return "bg-amber-50 text-amber-700 border-amber-200";
                    }
                  };

                  return (
                    <div
                      key={reg.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/40 hover:bg-emerald-50/20 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-700 font-mono">
                            {reg.nomorAntrean}
                          </span>
                          <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <Building2 size={12} className="text-gray-400" />
                            {reg.poli?.nama || "Poli"}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getStatusBadge(
                              reg.status
                            )}`}
                          >
                            {reg.status}
                          </span>
                        </div>

                        <p className="text-gray-500 text-[11px]">
                          Dokter: <span className="font-medium text-gray-700">{reg.dokter?.nama || "-"}</span> |{" "}
                          Pembayaran: <span className="font-medium text-gray-700">{reg.jenisPembayaran}</span>
                        </p>

                        {reg.keluhanAwal && (
                          <p className="text-gray-600 italic text-[11px]">
                            &ldquo;{reg.keluhanAwal}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="text-left sm:text-right shrink-0 text-gray-400 text-[11px]">
                        <span className="flex items-center sm:justify-end gap-1">
                          <Calendar size={12} />
                          {formatDate(reg.tanggalKunjungan)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2 shrink-0">
          <div>
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(pasien)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <Edit2 size={14} />
                Edit Data Pasien
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasienDetailModal;
