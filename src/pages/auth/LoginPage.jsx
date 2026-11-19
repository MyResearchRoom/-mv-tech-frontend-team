import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AlertCircle, Check, ChevronRight, Eye, EyeOff, Info, Lock, Mail, ShieldCheck } from 'lucide-react';
import logo from '../../assets/common/logo1.png';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routePaths';
import { loginSuccess } from '@/store/slices/authSlice';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/utils/helpers';
import AuthService from "@/services/authService";
import { notifyError } from '../../utils/viewDocument';

const BRAND_NAME = 'MV Techproducts';
const BRAND_PRODUCT = 'Fire safety ERP';
const JOURNEY = ['Client', 'Design', 'Execution', 'Closure'];

const gridBackground = {
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
};

function BrandLogo({ size = 40, className }) {
  return (
    <span
      className={cn('flex shrink-0 items-center justify-center rounded-xl bg-white shadow-lg shadow-black/10', className)}
      style={{ width: size, height: size }}
    >
      <img src={logo} alt="MV Techproducts logo" className="h-[70%] w-[70%] object-contain" draggable="false" />
    </span>
  );
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const pickRole = (role) => {
    setSelectedRoleId(role.id);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!selectedRoleId) {
      setError("Please select role.");
      notifyError(dispatch, "Please select role.");
      return;
    }

    if (!cleanEmail || !password) {
      setError("Enter your work email and password.");
      notifyError(dispatch, "Enter your work email and password.");
      return;
    }



    try {
      setIsLoading(true);

      const response = await AuthService.login({
        email: cleanEmail,
        password,
        role: selectedRoleId,
      });

      if (!response.success) {
        setError(response.message || "Login failed.");
        return;
      }

      const loginData = response.data;
      const loggedInUser = loginData.user || loginData;

      setSelectedRoleId(loggedInUser.roleId || loggedInUser.role);

      dispatch(loginSuccess(loginData));

      navigate(
        location.state?.from?.pathname || ROUTES.DASHBOARD,
        { replace: true }
      );
    } catch (err) {
      const responseData = err.response?.data;
      const responseMessage =
        typeof responseData === 'string'
          ? responseData
          : responseData?.message || responseData?.error?.message;

      if (responseMessage) {
        setError(responseMessage);
      } else if (err.response) {
        setError(`Login failed (HTTP ${err.response.status}).`);
      } else if (err.request) {
        setError('Unable to connect to the login service. Check that the backend is running and VITE_API_BASE_URL is correct.');
      } else {
        setError(err.message || 'Something went wrong during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full bg-white">
      <aside className="relative hidden w-[46%] max-w-[760px] shrink-0 overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="pointer-events-none absolute inset-0" style={gridBackground} aria-hidden="true" />
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-24 w-[520px] select-none opacity-[0.1]"
        />

        <div className="relative flex items-center gap-3">
          <BrandLogo size={52} />
          <div className="leading-tight">
            <p className="text-lg font-semibold tracking-tight">{BRAND_NAME}</p>
            <p className="text-sm text-sky-300/80">{BRAND_PRODUCT}</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight xl:text-6xl">
            Every project.
            <br />
            Fully controlled.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-300">
            One connected workspace from client onboarding and technical design through installation, final accounts and closure.
          </p>
        </div>

        <div className="relative space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={18} className="text-sky-400" /> Complete project traceability
            </p>
            <ol className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              {JOURNEY.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight size={14} className="text-slate-500" aria-hidden="true" />}
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs text-slate-400">Role-based access and audit-ready approvals. Demo environment.</p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-10 sm:px-10">
        <div className="w-full max-w-[520px]">
          {/* Brand header shown when the side panel is hidden */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandLogo size={44} className="border border-slate-200 shadow-sm" />
            <div className="leading-tight">
              <p className="text-base font-semibold text-slate-900">{BRAND_NAME}</p>
              <p className="text-xs text-slate-500">{BRAND_PRODUCT}</p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your project operations workspace.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-slate-700">Sign in as</legend>
              <div role="radiogroup" aria-label="Sign in as" className="grid gap-2.5 sm:grid-cols-2">
                {ROLES.map((role) => {
                  const selected = role.id === selectedRoleId;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pickRole(role)}
                      className={cn(
                        'flex items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                        selected ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/30' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold',
                          selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {role.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold leading-snug text-slate-800">{role.label}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-slate-500">{role.description}</span>
                      </span>
                      {selected && <Check size={16} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Work email
              </label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="you@mvtech.in"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button 
                  type="button" 
                  // onClick={() => setShowResetHint((v) => !v)} 
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-12 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
             
            </div>

            <div aria-live="polite">
              {error && (
                <p className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in to ERP"}
            </button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
            <Info size={13} aria-hidden="true" />
            Demo credentials are pre-filled. Select any role to preview access.
          </p>
        </div>
      </main>
    </div>
  );
}