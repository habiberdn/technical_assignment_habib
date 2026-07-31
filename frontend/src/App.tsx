import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.js";
import { Layout } from "./components/layout/Layout.js";

import { LoginPage } from "./pages/LoginPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { PasienPage } from "./pages/PasienPage.js";
import { PoliPage } from "./pages/PoliPage.js";
import { AntreanPage } from "./pages/AntreanPage.js";
import { PemeriksaanPage } from "./pages/PemeriksaanPage.js";
import { StafPage } from "./pages/StafPage.js";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Protected Shell */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/pasien" element={<PasienPage />} />
              <Route path="/poli" element={<PoliPage />} />
              <Route path="/antrean" element={<AntreanPage />} />
              <Route path="/pemeriksaan" element={<PemeriksaanPage />} />
              <Route path="/staf" element={<StafPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
