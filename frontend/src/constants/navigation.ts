import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck2,
  Stethoscope,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: string[];
}

export const NAV_ITEMS: NavItem[] = [
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
    label: "Antrean",
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

export const ROLE_BADGE_STYLES: Record<string, string> = {
  ADMIN: "bg-rose-50 text-rose-700 border-rose-200",
  DOKTER: "bg-purple-50 text-purple-700 border-purple-200",
  PETUGAS_PENDAFTARAN: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const getRoleBadgeColor = (role: string): string => {
  return ROLE_BADGE_STYLES[role] || "bg-gray-50 text-gray-700 border-gray-200";
};
