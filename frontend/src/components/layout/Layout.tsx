import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.js";
import { NAV_ITEMS, getRoleBadgeColor } from "@/constants/navigation.js";
import {
  LogOut,
  Activity,
  Plus,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileSidebarOpen(false);
    await logout();
    navigate("/login");
  };

  const filteredNavItems = NAV_ITEMS.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900">
      {/* Backdrop for Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-150"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigasi (Responsive: fixed drawer on mobile, static on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo & Mobile Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-gray-900">
                MediKlinik SIMRS
              </h1>
              <p className="text-[10px] font-medium text-emerald-600">
                Sistem Klinik
              </p>
            </div>
          </div>
          {/* Close button for mobile screen */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            Menu Utama
          </div>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-gray-400"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button New Registration (Admin & Petugas Pendaftaran Only) */}
        {(user?.role === "ADMIN" || user?.role === "PETUGAS_PENDAFTARAN") && (
          <div className="border-t border-gray-100 p-4">
            <button
              type="button"
              onClick={() => {
                setIsMobileSidebarOpen(false);
                navigate("/antrean", { state: { openCreateModal: true, timestamp: Date.now() } });
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 cursor-pointer"
            >
              <Plus size={16} />
              Daftar Antrean
            </button>
          </div>
        )}
      </aside>

      {/* Main Right Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-8">
          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-xs">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-extrabold text-gray-900">MediKlinik</span>
            </div>
          </div>

          {/* Avatar Dropdown Trigger (Right side) */}
          <div className="relative ml-auto" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-label="Menu Pengguna"
              aria-expanded={isUserMenuOpen}
              className="flex items-center gap-2 rounded-full p-1.5 transition-colors hover:bg-gray-100 focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm shadow-xs border border-emerald-200">
                {user?.nama ? user.nama.charAt(0).toUpperCase() : "U"}
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu (OnClick Floating Card) */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Header Section */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-base shadow-xs">
                    {user?.nama ? user.nama.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-gray-900">
                      {user?.nama || "Pengguna"}
                    </p>
                    <p className="truncate text-[11px] text-gray-500">
                      @{user?.username}
                    </p>
                    {user?.role && (
                      <span
                        className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase ${getRoleBadgeColor(
                          user.role,
                        )}`}
                      >
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>

                <div className="my-1 border-t border-gray-100" />

                {/* Dropdown Items */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} className="text-gray-400" />
                    Pengaturan Akun
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
