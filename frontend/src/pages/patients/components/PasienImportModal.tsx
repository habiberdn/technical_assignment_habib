import React, { useState, useRef, type ChangeEvent } from "react";
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { pasienService } from "@/services/pasienService.js";
import type { CreatePasienDTO } from "@/dtos/pasien.dto.js";
import { PASIEN_CSV_TEMPLATE } from "@/constants/pasien.js";

interface PasienImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedPasien {
  nik: string;
  nama: string;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
  tanggalLahir: string;
  noTelepon: string;
  alamat: string;
  isValid: boolean;
  errorReason?: string;
}

export const PasienImportModal: React.FC<PasienImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [parsedData, setParsedData] = useState<ParsedPasien[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [importing, setImporting] = useState<boolean>(false);
  const [importProgress, setImportProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Parse CSV File Content
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        parseCSV(text);
      } catch (err) {
        console.error("[Import parse error]", err);
        setErrorMsg("Gagal membaca berkas. Pastikan format CSV/Excel sesuai template.");
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const parseCSV = (csvText: string) => {
    // Clean BOM if present
    const cleanText = csvText.replace(/^\uFEFF/, "");
    const lines = cleanText.split(/\r?\n/).filter((line) => line.trim().length > 0);

    if (lines.length <= 1) {
      setErrorMsg("File CSV kosong atau hanya berisi baris header.");
      setParsedData([]);
      return;
    }

    // Determine delimiter (comma or semicolon)
    const firstLine = lines[0];
    const delimiter = firstLine.includes(";") ? ";" : ",";

    const rows: ParsedPasien[] = [];

    // Skip header line (index 0)
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map((col) => col.replace(/^"(.*)"$/, "$1").trim());
      if (cols.length < 5) continue; // Skip incomplete lines

      const nik = cols[0] || cols[1] || "";
      const nama = cols[1] || cols[2] || "";
      const jkRaw = (cols[2] || cols[3] || "").toUpperCase();
      const tanggalLahir = cols[3] || cols[4] || "";
      const noTelepon = cols[4] || cols[5] || "";
      const alamat = cols[5] || cols[6] || "-";

      const jenisKelamin: "LAKI_LAKI" | "PEREMPUAN" =
        jkRaw.includes("PEREMPUAN") || jkRaw === "P" || jkRaw.includes("FEMALE")
          ? "PEREMPUAN"
          : "LAKI_LAKI";

      // Simple validation
      let isValid = true;
      let errorReason = "";

      if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
        isValid = false;
        errorReason = "NIK harus 16 digit angka";
      } else if (!nama) {
        isValid = false;
        errorReason = "Nama wajib diisi";
      }

      rows.push({
        nik,
        nama,
        jenisKelamin,
        tanggalLahir: tanggalLahir || "1990-01-01",
        noTelepon: noTelepon || "081234567890",
        alamat,
        isValid,
        errorReason,
      });
    }

    setParsedData(rows);
  };

  // Download Sample Template CSV
  const downloadTemplate = () => {
    const blob = new Blob([PASIEN_CSV_TEMPLATE.content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = PASIEN_CSV_TEMPLATE.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Submit Import to Backend
  const handleImportSubmit = async () => {
    const validRows = parsedData.filter((item) => item.isValid);
    if (validRows.length === 0) {
      setErrorMsg("Tidak ada data valid yang dapat di-import.");
      return;
    }

    setImporting(true);
    setErrorMsg(null);
    setImportProgress({ current: 0, total: validRows.length });

    for (let i = 0; i < validRows.length; i++) {
      const item = validRows[i];
      try {
        const payload: CreatePasienDTO = {
          nik: item.nik,
          nama: item.nama,
          jenisKelamin: item.jenisKelamin,
          tanggalLahir: item.tanggalLahir ? new Date(item.tanggalLahir) : new Date(),
          noTelepon: item.noTelepon,
          alamat: item.alamat,
        };
        await pasienService.createPasien(payload);
      } catch (err) {
        console.error(`[Import item failed: ${item.nama}]`, err);
      }
      setImportProgress({ current: i + 1, total: validRows.length });
    }

    setImporting(false);
    onSuccess();
    onClose();
  };

  const validCount = parsedData.filter((d) => d.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Import Data Pasien (Excel / CSV)</h2>
              <p className="text-xs text-gray-500">
                Unggah berkas CSV atau Excel untuk menambahkan data pasien secara massal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={importing}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Area */}
        <div className="mt-4 space-y-4">
          {/* File Picker & Download Template Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Upload size={15} />
                Pilih Berkas CSV/Excel
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
                {fileName || "Belum ada berkas dipilih"}
              </span>
            </div>

            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <Download size={14} />
              Unduh Template Format CSV
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertTriangle size={16} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-gray-800">
                  Pratinjau Data ({parsedData.length} baris terdeteksi)
                </span>
                <span className="font-medium text-emerald-700">
                  {validCount} baris valid siap diimport
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-100 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">NIK</th>
                      <th className="px-3 py-2">Nama Pasien</th>
                      <th className="px-3 py-2">Jenis Kelamin</th>
                      <th className="px-3 py-2">Telepon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedData.map((row, idx) => (
                      <tr
                        key={idx}
                        className={row.isValid ? "hover:bg-gray-50" : "bg-red-50/40 hover:bg-red-50/60"}
                      >
                        <td className="px-3 py-2">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                              <CheckCircle2 size={13} /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600" title={row.errorReason}>
                              <AlertTriangle size={13} /> Error
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-800">{row.nik || "-"}</td>
                        <td className="px-3 py-2 font-semibold text-gray-800">{row.nama || "-"}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {row.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                        </td>
                        <td className="px-3 py-2 text-gray-600 font-mono">{row.noTelepon || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Progress Bar during Import */}
          {importing && (
            <div className="space-y-1.5 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
              <div className="flex justify-between font-semibold">
                <span>Memproses import data pasien...</span>
                <span>
                  {importProgress.current} / {importProgress.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-200">
                <div
                  className="h-full bg-emerald-600 transition-all duration-200"
                  style={{
                    width: `${(importProgress.current / importProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleImportSubmit}
            disabled={importing || validCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Upload size={14} />
            {importing ? "Mengimport..." : `Proses Import (${validCount} Pasien)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasienImportModal;
