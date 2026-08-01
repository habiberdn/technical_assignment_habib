import React from "react";
import { Edit2, KeyRound, ShieldAlert, CheckCircle2, XCircle, Building2, User, UserCheck } from "lucide-react";
import type { UserItem, UserRole } from "@/types/user.types.js";

interface StaffTableProps {
  users: UserItem[];
  loading: boolean;
  currentUserId: string;
  onEdit: (user: UserItem) => void;
  onToggleStatus: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
}

export const StaffTable: React.FC<StaffTableProps> = ({
  users,
  loading,
  currentUserId,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 border border-purple-200">
            <ShieldAlert size={13} className="shrink-0" />
            ADMINISTRATOR
          </span>
        );
      case "DOKTER":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
            <User size={13} className="shrink-0" />
            DOKTER (DPJP)
          </span>
        );
      case "PETUGAS_PENDAFTARAN":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <UserCheck size={13} className="shrink-0" />
            PETUGAS PENDAFTARAN
          </span>
        );
      default:
        return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-700">{role}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-xs text-gray-400 shadow-xs">
        <div className="flex justify-center items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
          Memuat data staff...
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-xs text-gray-400 shadow-xs">
        Tidak ada data staff / pengguna yang sesuai dengan filter pencarian.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="px-5 py-3.5">Nama & Username</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Poliklinik</th>
              <th className="px-5 py-3.5">Status Akun</th>
              <th className="px-5 py-3.5">Terdaftar</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {users.map((userItem) => {
              const isSelf = userItem.id === currentUserId;
              const cleanPoliName = userItem.poli?.nama
                ? userItem.poli.nama.replace(/\s*\(.*?\)/g, "").replace(/\s*\[.*?\]/g, "").trim()
                : null;

              return (
                <tr key={userItem.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Nama & Username */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-mono border border-emerald-200">
                        {userItem.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 text-sm">{userItem.nama}</span>
                          {isSelf && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200">
                              Anda
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">@{userItem.username}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">{getRoleBadge(userItem.role)}</td>

                  {/* Poli */}
                  <td className="px-5 py-4">
                    {cleanPoliName ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800 border border-gray-200">
                        <Building2 size={13} className="text-gray-500 shrink-0" />
                        {cleanPoliName}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">-</span>
                    )}
                  </td>

                  {/* Status Akun */}
                  <td className="px-5 py-4">
                    {userItem.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={13} /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                        <XCircle size={13} /> Nonaktif
                      </span>
                    )}
                  </td>

                  {/* Tanggal Terdaftar */}
                  <td className="px-5 py-4 text-gray-500 font-mono">{formatDate(userItem.createdAt)}</td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Reset Password */}
                      <button
                        onClick={() => onResetPassword(userItem)}
                        title="Reset Kata Sandi"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <KeyRound size={14} />
                      </button>

                      {/* Edit User */}
                      <button
                        onClick={() => onEdit(userItem)}
                        title="Edit Data Staff"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>

                      {/* Toggle Active / Nonactive Status */}
                      <button
                        onClick={() => onToggleStatus(userItem)}
                        disabled={isSelf}
                        title={isSelf ? "Tidak dapat menonaktifkan akun sendiri" : userItem.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                        className={`flex h-8 px-2.5 items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition-colors shadow-2xs ${
                          isSelf
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                            : userItem.isActive
                            ? "border-red-200 bg-white text-red-600 hover:bg-red-50 cursor-pointer"
                            : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        }`}
                      >
                        {userItem.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
