import { Building2, FileText, Users } from 'lucide-react';
import { cn } from '@/utils/helpers';

const tabs = [
  { id: 'list', label: 'Company List', icon: Building2 },
  { id: 'details', label: 'Company Details', icon: FileText },
  { id: 'access', label: 'User Company Access', icon: Users },
  { id: 'employee', label: 'Employee management', icon: Users },
  { id: 'control', label: 'Access Control', icon: Users },
];

export default function SettingsTabNavigation({ activeTab, onChange }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex min-w-max gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold transition-all duration-200',
              activeTab === id
                ? 'border-blue-200 bg-blue-50 text-blue-800 shadow-sm ring-1 ring-blue-100'
                : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700'
            )}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
