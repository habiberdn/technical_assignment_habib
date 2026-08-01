import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute.js";
import { Layout } from "@/components/layout/Layout.js";

import LoginPage from "@/pages/auth/Login.js";
import AdminDashboard from "@/pages/dashboard/AdminDashboard.js";
import PatientListPage from "@/pages/patients/PatientListPage.js";
import PoliListPage from "@/pages/poli/PoliListPage.js";
import RegistrationPage from "@/pages/registrations/RegistrationPage.js";
import PemeriksaanPage from "@/pages/medical-records/PemeriksaanPage.js";
import StaffListPage from "@/pages/staff/StaffListPage.js";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<AdminDashboard />} />

          <Route element={<ProtectedRoute allowedRoles={["ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"]} />}>
            <Route path="/pasien" element={<PatientListPage />} />
            <Route path="/poli" element={<PoliListPage />} />
            <Route path="/antrean" element={<RegistrationPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN", "DOKTER"]} />}>
            <Route path="/pemeriksaan" element={<PemeriksaanPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/staf" element={<StaffListPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
