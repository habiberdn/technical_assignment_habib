import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute.js";
import { Layout } from "@/components/layout/Layout.js";

import LoginPage from "@/pages/auth/Login.js";
import AdminDashboard from "@/pages/dashboard/AdminDashboard.js";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Protected Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/pasien" element={<div className="p-6">Master Pasien (Dalam Pengembangan)</div>} />
          <Route path="/antrean" element={<div className="p-6">Modul Antrean (Dalam Pengembangan)</div>} />
          <Route path="/pemeriksaan" element={<div className="p-6">Pemeriksaan Dokter SOAP (Dalam Pengembangan)</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
