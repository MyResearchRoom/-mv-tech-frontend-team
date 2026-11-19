import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, Check, X } from 'lucide-react';
import { clearToast } from '@/store/slices/uiSlice';

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => {
      dispatch(clearToast());
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [dispatch, toast]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={`fixed right-5 top-5 z-[100] flex max-w-sm items-start gap-3 rounded-xl border p-4 shadow-xl ${
        isError
          ? 'border-red-200 bg-white text-red-800'
          : 'border-emerald-200 bg-white text-emerald-800'
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isError ? 'bg-red-100' : 'bg-emerald-100'
        }`}
      >
        {isError ? <AlertCircle size={16} /> : <Check size={16} />}
      </span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dispatch(clearToast())}
        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X size={16} />
      </button>
    </div>
  );
}
