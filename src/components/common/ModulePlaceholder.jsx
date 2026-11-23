import PageHeader from './PageHeader';

// Temporary body for pages that are not designed yet. Delete usage as each page gets built.
export default function ModulePlaceholder({ title, description }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
        <p className="text-sm text-slate-400">This page has not been built yet.</p>
      </div>
    </>
  );
}
