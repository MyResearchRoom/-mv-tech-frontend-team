import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import AddCompanyModal from '@/models/settings/AddCompanyModal';
import { SearchProvider } from '@/context/SearchContext';

export default function MainLayout() {
  const editingCompanyId = useSelector((state) => state.ui.editingCompanyId);

  return (
    <SearchProvider>
      <div className="flex h-full overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-3">
            <Outlet />
          </main>
        </div>

        {/* <Link
        to={ROUTES.PROSPECT_NEW}
        className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700"
      >
        <Plus size={18} /> Onboard New Client
      </Link> */}
        <AddCompanyModal companyId={editingCompanyId} />
      </div>
    </SearchProvider>
  );
}
