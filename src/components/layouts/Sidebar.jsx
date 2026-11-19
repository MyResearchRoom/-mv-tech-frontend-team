
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PanelLeftClose, PanelLeftOpen, ShieldCheck, X } from 'lucide-react';

import { SIDEBAR_MENU, SIDEBAR_SETTINGS } from '@/constants/sidebarMenu';
import { closeMobileSidebar, toggleSidebar } from '@/store/slices/uiSlice';
import CompanySwitcher from './CompanySwitcher';
import { cn } from '@/utils/helpers';
import logo from '../../assets/common/logo1.png';

export default function Sidebar() {
  const dispatch = useDispatch();

  const { sidebarCollapsed, mobileSidebarOpen, ...counts } =
    useSelector((s) => s.ui);

  const collapsed = sidebarCollapsed;

  // Reusable menu item
  const renderMenuItem = ({ key, label, path, icon: Icon, badgeKey }) => {
    const badge = badgeKey ? counts[badgeKey] : 0;

    return (
      <NavLink
        key={key}
        to={path}
        title={collapsed ? label : undefined}
        onClick={() => dispatch(closeMobileSidebar())}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-white/10 hover:text-white',
            collapsed && 'lg:justify-center lg:px-0'
          )
        }
      >
        <Icon size={19} className="shrink-0" />

        <span className={cn('flex-1 truncate', collapsed && 'lg:hidden')}>
          {label}
        </span>

        {badge > 0 && (
          <span
            className={cn(
              'rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white',
              collapsed &&
                'lg:absolute lg:right-1 lg:top-1 lg:h-4 lg:min-w-4 lg:px-1 lg:py-0 lg:text-[9px] lg:leading-4 lg:bg-red-500'
            )}
          >
            {badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={() => dispatch(closeMobileSidebar())}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-hidden bg-navy-900 text-slate-300 transition-all duration-200',
          'lg:static lg:translate-x-0',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'lg:w-[76px]' : 'lg:w-64'
        )}
      >
        
      {/* Brand / Logo */}
<div
  className={cn(
    'flex h-20 shrink-0 items-center gap-3 px-3',
    collapsed && 'lg:justify-center lg:px-0'
  )}
>
  {/* Logo */}
  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5">
    <img
      src={logo}
      alt="MV Techproducts ERP"
      className="h-full w-full object-contain"
    />
  </div>

  {/* Brand Name */}
  <span className={cn('flex-1 leading-tight', collapsed && 'lg:hidden')}>
    <span className="block text-base font-bold tracking-wide text-white">
      MV
    </span>
    <span className="block text-[12px] tracking-widest text-slate-100 ">
      TECHPRODUCTS
    </span>
  </span>

  {/* Mobile Close */}
  <button
    type="button"
    onClick={() => dispatch(closeMobileSidebar())}
    className="rounded-md p-1 text-slate-400 hover:bg-white/10 lg:hidden"
    aria-label="Close menu"
  >
    <X size={18} />
  </button>

  {/* Desktop Collapse */}
  <button
    type="button"
    onClick={() => dispatch(toggleSidebar())}
    className={cn(
      'hidden rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:block',
      collapsed && 'lg:hidden'
    )}
    aria-label="Collapse sidebar"
  >
    <PanelLeftClose size={18} />
  </button>
</div>


        {/* Expand sidebar */}
        {collapsed && (
          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className="mx-auto mb-2 hidden rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:block"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}

        {/* Active company */}
        <div
          className={cn(
            'shrink-0 px-3 pb-3',
            collapsed && 'lg:px-2'
          )}
        >
          <CompanySwitcher variant="sidebar" collapsed={collapsed} />
        </div>

        <nav
          className="thin-scroll min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-2"
          aria-label="Main"
        >
          {SIDEBAR_MENU.map(renderMenuItem)}
        </nav>


        <div
          className={cn(
            'shrink-0 border-t border-white/10 px-3 py-2',
            collapsed && 'lg:px-2'
          )}
        >
          {renderMenuItem(SIDEBAR_SETTINGS)}
        </div>

        {/* Fixed Footer Status */}
        <div
          className={cn(
            'm-3 flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3',
            collapsed && 'lg:justify-center lg:p-2'
          )}
        >
          <ShieldCheck size={18} className="shrink-0 text-emerald-400" />

          <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
            <p className="text-xs font-semibold text-white">
              System secure
            </p>
            <p className="text-[11px] text-slate-400">
              Role-based access enabled
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
