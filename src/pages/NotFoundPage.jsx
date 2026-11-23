import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routePaths';

export default function NotFoundPage() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="mt-3 text-lg font-semibold text-slate-800">Page not found</h1>
      <p className="mt-1 text-sm text-slate-500">The page you are looking for does not exist.</p>
      <Link to={ROUTES.DASHBOARD} className="mt-5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        Back to dashboard
      </Link>
    </div>
  );
}
