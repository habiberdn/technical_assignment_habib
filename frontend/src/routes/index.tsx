import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute.js";
import { Layout } from "@/components/layout/Layout.js";

import LoginPage from "@/pages/auth/Login.js";
import AdminDashboard from "@/pages/dashboard/AdminDashboard.js";
import PatientListPage from "@/pages/patients/PatientListPage.js";
import PoliListPage from "@/pages/poli/PoliListPage.js";
import RegistrationPage from "@/pages/registrations/RegistrationPage.js";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Protected Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/pasien" element={<PatientListPage />} />
          <Route path="/poli" element={<PoliListPage />} />
          <Route path="/antrean" element={<RegistrationPage />} />
          <Route path="/pemeriksaan" element={<div className="p-6">Pemeriksaan Dokter SOAP (Dalam Pengembangan)</div>} />
          <Route path="/staf" element={<div className="p-6">Kelola Staf (Dalam Pengembangan)</div>} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
