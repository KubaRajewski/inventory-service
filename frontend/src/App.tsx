import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import StocksPage from "@/pages/StocksPage";
import MovementsPage from "@/pages/MovementsPage";
import SalesImportPage from "@/pages/SalesImportPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
    return (
        <AppShell>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/stocks" element={<StocksPage />} />
                <Route path="/movements" element={<MovementsPage />} />
                <Route path="/sales-import" element={<SalesImportPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppShell>
    );
}
