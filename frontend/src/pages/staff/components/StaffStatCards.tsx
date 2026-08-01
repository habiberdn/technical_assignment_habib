import React from "react";
import { Users, Stethoscope, UserCheck, ShieldCheck } from "lucide-react";

interface StaffStatCardsProps {
  stats: {
    total: number;
    dokterCount: number;
    petugasCount: number;
    activeCount: number;
  };
}

export const StaffStatCards: React.FC<StaffStatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <div className="flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
          <Users size={20} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total Staff</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
      </div>

      <div className="flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
          <Stethoscope size={20} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Dokter (DPJP)</p>
          <p className="text-xl font-bold text-gray-900">{stats.dokterCount}</p>
        </div>
      </div>

      <div className="flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-2xs">
          <UserCheck size={20} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Petugas Pendaftaran</p>
          <p className="text-xl font-bold text-gray-900">{stats.petugasCount}</p>
        </div>
      </div>

      <div className="flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100 shadow-2xs">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Akun Aktif</p>
          <p className="text-xl font-bold text-gray-900">{stats.activeCount}</p>
        </div>
      </div>
    </div>
  );
};
