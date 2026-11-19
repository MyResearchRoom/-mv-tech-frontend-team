import {
  LayoutDashboard,
  UserPlus,
  Users,
  FolderKanban,
  PencilRuler,
  Calculator,
  FileText,
  ShoppingCart,
  Package,
  Wrench,
  Landmark,
  ClipboardCheck,
  BarChart3,
  Settings,
} from 'lucide-react';

import { ROUTES } from './routePaths';

export const SIDEBAR_MENU = [
  { key: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { key: 'prospects', label: 'Prospects', path: ROUTES.PROSPECTS, icon: UserPlus },
  { key: 'clients', label: 'Clients', path: ROUTES.CLIENTS, icon: Users },
  { key: 'projects', label: 'Projects', path: ROUTES.PROJECTS, icon: FolderKanban },
  { key: 'design-drawings', label: 'Design & Drawings', path: ROUTES.DESIGN_DRAWINGS, icon: PencilRuler },
  { key: 'boq-estimation', label: 'BOQ & Estimation', path: ROUTES.BOQ_ESTIMATION, icon: Calculator },
  { key: 'quotations-po', label: 'Quotations & PO', path: ROUTES.QUOTATIONS_PO, icon: FileText },
  { key: 'procurement', label: 'Procurement', path: ROUTES.PROCUREMENT, icon: ShoppingCart },
  { key: 'inventory-grn', label: 'Inventory & GRN', path: ROUTES.INVENTORY_GRN, icon: Package },
  { key: 'execution', label: 'Execution', path: ROUTES.EXECUTION, icon: Wrench },
  { key: 'finance-accounts', label: 'Finance & Accounts', path: ROUTES.FINANCE_ACCOUNTS, icon: Landmark },
  { key: 'approvals', label: 'Approvals', path: ROUTES.APPROVALS, icon: ClipboardCheck, badgeKey: 'pendingApprovals' },
  { key: 'reports', label: 'Reports', path: ROUTES.REPORTS, icon: BarChart3 },
];

// Fixed Settings menu
export const SIDEBAR_SETTINGS = {
  key: 'settings',
  label: 'Settings',
  path: ROUTES.SETTINGS,
  icon: Settings,
};

// Extra breadcrumb labels
export const SUB_ROUTE_LABELS = {
  [ROUTES.PROSPECT_NEW]: 'Onboard new client',
};