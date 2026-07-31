import React from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck2,
  Stethoscope,
  LogOut,
  Activity,
  UserCheck,
} from "lucide-react";

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: ["ADMIN", "DOKTER", "PETUGAS_PENDAFTARAN"],
    },
    {
      label: "Master Pasien",
      path: "/pasien",
      icon: Users,
      roles: ["ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"],
    },
    {
      label: "Master Poli",
      path: "/poli",
      icon: Building2,
      roles: ["ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"],
    },
    {
      label: "Pendaftaran & Antrean",
      path: "/antrean",
      icon: CalendarCheck2,
      roles: ["ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"],
    },
    {
      label: "Pemeriksaan SOAP",
      path: "/pemeriksaan",
      icon: Stethoscope,
      roles: ["ADMIN", "DOKTER", "PETUGAS_PENDAFTARAN"],
    },
    {
      label: "Kelola Staf",
      path: "/staf",
      icon: UserCheck,
      roles: ["ADMIN"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "DOKTER":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "PETUGAS_PENDAFTARAN":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigasi */}
      <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-md">
        {/* Brand Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-teal-600 to-emerald-500 shadow-lg shadow-teal-500/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white">
              SIMRS Clinic
            </h1>
            <p className="text-[10px] font-medium text-teal-400">
              Sistem Manajemen Medis
            </p>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Menu Utama
          </div>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer User Info Card */}
        {user && (
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 border border-slate-800">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-200">
                  {user.nama}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase ${getRoleBadgeColor(
                    user.role,
                  )}`}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 transition-colors hover:bg-rose-500/20"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Right Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-8 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-400">
              Status Server: Online
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-200">{user?.nama}</p>
              <p className="text-[10px] text-slate-400">@{user?.username}</p>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
