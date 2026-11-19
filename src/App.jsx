import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/constants/routePaths';
import Toast from '@/components/common/Toast';

import ProtectedRoute from '@/routes/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProspectsPage from '@/pages/prospects/ProspectsPage';
import OnboardClientPage from '@/pages/prospects/OnboardClientPage';
import ClientsPage from '@/pages/clients/ClientsPage';
import ProjectsPage from '@/pages/projects/ProjectsPage';
import DesignDrawingsPage from '@/pages/design-drawings/DesignDrawingsPage';
import BoqEstimationPage from '@/pages/boq-estimation/BoqEstimationPage';
import QuotationsPoPage from '@/pages/quotations-po/QuotationsPoPage';
import ProcurementPage from '@/pages/procurement/ProcurementPage';
import InventoryGrnPage from '@/pages/inventory-grn/InventoryGrnPage';
import ExecutionPage from '@/pages/execution/ExecutionPage';
import FinanceAccountsPage from '@/pages/finance-accounts/FinanceAccountsPage';
import ApprovalsPage from '@/pages/approvals/ApprovalsPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Signed-in area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            <Route path={ROUTES.PROSPECTS} element={<ProspectsPage />} />
            <Route path={ROUTES.PROSPECT_NEW} element={<OnboardClientPage />} />
            <Route path={ROUTES.CLIENTS} element={<ClientsPage />} />
            <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />

            <Route path={ROUTES.DESIGN_DRAWINGS} element={<DesignDrawingsPage />} />
            <Route path={ROUTES.BOQ_ESTIMATION} element={<BoqEstimationPage />} />
            <Route path={ROUTES.QUOTATIONS_PO} element={<QuotationsPoPage />} />

            <Route path={ROUTES.PROCUREMENT} element={<ProcurementPage />} />
            <Route path={ROUTES.INVENTORY_GRN} element={<InventoryGrnPage />} />
            <Route path={ROUTES.EXECUTION} element={<ExecutionPage />} />
            <Route path={ROUTES.FINANCE_ACCOUNTS} element={<FinanceAccountsPage />} />

            <Route path={ROUTES.APPROVALS} element={<ApprovalsPage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
      <Toast />
    </>
  );
}
