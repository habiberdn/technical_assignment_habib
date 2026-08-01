import React from "react";
import { ClipboardList, MoreVertical } from "lucide-react";
import type { QueueEntry, QueueStatus } from "@/types/dashboard.types.js";

const STATUS_STYLES: Record<QueueStatus, { label: string; className: string }> = {
  MENUNGGU: { label: "Menunggu", className: "bg-amber-100 text-amber-800" },
  CHECK_IN: { label: "Check In", className: "bg-blue-100 text-blue-800" },
  PEMERIKSAAN: { label: "• Pemeriksaan", className: "bg-emerald-100 text-emerald-800 font-semibold" },
  SELESAI: { label: "Selesai", className: "bg-gray-100 text-gray-700" },
};

export const StatusBadge: React.FC<{ status: QueueStatus }> = ({ status }) => {
  const style = STATUS_STYLES[status] || { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style.className}`}>
      {style.label}
    </span>
  );
};

interface QueueTableProps {
  entries: QueueEntry[];
  loading?: boolean;
  onActionClick?: (entry: QueueEntry) => void;
}

export const QueueTable: React.FC<QueueTableProps> = ({ entries, loading = false, onActionClick }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
            <ClipboardList size={16} />
          </span>
          <h2 className="text-sm font-semibold text-gray-900">Daftar Antrean Real-time Hari Ini</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3 font-semibold">Nama Pasien</th>
              <th className="px-5 py-3 font-semibold">Poli</th>
              <th className="px-5 py-3 font-semibold">No. Antrean</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                  Memuat data antrean...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                  Belum ada antrean kunjungan pasien hari ini.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${entry.avatarColor}`}
                      >
                        {entry.initials}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{entry.patientName}</p>
                        <p className="text-xs text-gray-400">{entry.medicalRecordNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600 font-medium">{entry.clinic}</td>
                  <td className="px-5 py-3 text-gray-800 font-bold">{entry.queueNo}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onActionClick?.(entry)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      aria-label="Aksi antrean"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueueTable;
