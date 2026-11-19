import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, ChevronDown, ChevronRight, LogOut, Menu, Search } from 'lucide-react';
import { SIDEBAR_MENU, SUB_ROUTE_LABELS } from '@/constants/sidebarMenu';
import { ROUTES } from '@/constants/routePaths';
import { openMobileSidebar, showToast } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import AuthService from '@/services/authService';
import useAuth from '@/hooks/useAuth';
import useClickOutside from '@/hooks/useClickOutside';
import { useSearch } from '@/context/SearchContext';
import CompanySwitcher from './CompanySwitcher';

function useBreadcrumbs() {
  const { pathname } = useLocation();
  return useMemo(() => {
    const crumbs = [{ label: 'MV Tech ERP', to: ROUTES.DASHBOARD }];
    const section = SIDEBAR_MENU.find((m) => pathname === m.path || pathname.startsWith(`${m.path}/`));
    if (section) {
      crumbs.push({ label: section.label, to: section.path });
      if (SUB_ROUTE_LABELS[pathname]) crumbs.push({ label: SUB_ROUTE_LABELS[pathname] });
    }
    return crumbs;
  }, [pathname]);
}

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();
  const { user, role } = useAuth();
  // console.log("user",user);
  
  const unread = useSelector((s) => s.ui.unreadNotifications);
  const { searchTerm, setSearchTerm } = useSearch();

  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useClickOutside(menuRef, () => setMenuOpen(false));

  // Ctrl/⌘ + K focuses the search box
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setMenuOpen(false);
    let toast = {
      type: 'success',
      message: 'You have been logged out successfully.',
    };

    try {
      const response = await AuthService.logout();
      if (response?.success === false) {
        toast = {
          type: 'error',
          message: response.message || 'The server could not complete logout.',
        };
      } else if (response?.message) {
        toast.message = response.message;
      }
    } catch (error) {
      toast = {
        type: 'error',
        message:
          error.response?.data?.message ||
          (error.response
            ? `Logout failed (HTTP ${error.response.status}).`
            : error.request
              ? 'Could not connect to the logout service.'
              : error.message || 'Logout failed.'),
      };
    } finally {
      dispatch(logout());
      dispatch(showToast(toast));
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-18 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 py-1">
      <button
        type="button"
        onClick={() => dispatch(openMobileSidebar())}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm text-slate-500 md:flex">
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-slate-300" />}
            {c.to && i < crumbs.length - 1 ? (
              <Link to={c.to} className="hover:text-slate-800">
                {c.label}
              </Link>
            ) : (
              <span className={i === crumbs.length - 1 ? 'font-medium text-slate-800' : ''}>{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="hidden w-56 xl:block">
        <CompanySwitcher variant="header" />
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden w-full max-w-60 md:block">
        <Search size={16} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          ref={searchRef}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects, documents, clients..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-2 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        {/* <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          ⌘ K
        </kbd> */}
      </div>

      {/* Notifications */}
      <button type="button" className="relative rounded-xl border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50" aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>

      {/* User menu */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-slate-50"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          {user?.profile ? (
            <img
              src={user?.profile}
              alt={user?.name || "User"}
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-xs font-semibold text-white">
              {initials}
            </span>
          )}
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-semibold text-slate-800">{user?.name}</span>
            <span className="block text-xs text-slate-500">{role?.label}</span>
          </span>
          <ChevronDown size={16} className="hidden text-slate-500 sm:block" />
        </button>

        {menuOpen && (
          <div role="menu" className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isLoggingOut) {
              setShowLogoutConfirm(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                <LogOut size={19} />
              </span>
              <div>
                <h2 id="logout-confirm-title" className="text-base font-semibold text-slate-900">
                  Sign out?
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Are you sure you want to log out of your account?
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={15} />
                {isLoggingOut ? 'Logging out...' : 'Yes, log out'}
              </button>
            </div>
          </section>
        </div>
      )}
    </header>
  );
}
