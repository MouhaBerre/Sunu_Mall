import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { AuthProvider } from "../lib/auth";
import { AdminOverviewPage } from "../pages/AdminOverviewPage";
import { BestSellersPage } from "../pages/BestSellersPage";
import { LoginPage } from "../pages/LoginPage";
import { PremiumOverviewPage } from "../pages/PremiumOverviewPage";
import { TopRatedPage } from "../pages/TopRatedPage";
import { TrafficPage } from "../pages/TrafficPage";
import { TrendsPage } from "../pages/TrendsPage";
import { ProtectedRoute } from "../routes/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute role="merchant" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<PremiumOverviewPage />} />
              <Route path="/best-sellers" element={<BestSellersPage />} />
              <Route path="/top-rated" element={<TopRatedPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/traffic" element={<TrafficPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminOverviewPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
