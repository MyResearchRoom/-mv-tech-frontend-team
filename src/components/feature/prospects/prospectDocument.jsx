import { useEffect, useState } from 'react';
import { ExternalLink, Eye, FileText, Trash2, UploadCloud } from 'lucide-react';
import { useDispatch } from 'react-redux';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/context/SearchContext';
import ProspectService from '@/services/prospectService';
import { showToast } from '@/store/slices/uiSlice';
import UploadProspectDocumentsModal from '@/models/prospect/UploadProspectDocumentsModal';

const PAGE_SIZE = 10;

const formatDate = (date) => {
  if (!date) return '—';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getDocumentContent = (document) =>
  document.document ??
  document.fileData ??
  document.documentData ??
  document.content;

async function openDocumentContent(documentData, newWindow) {
  const content =
    getDocumentContent(documentData) ??
    documentData.url ??
    documentData.documentUrl ??
    documentData.fileUrl;

  if (content instanceof Blob) {
    newWindow.location.href = URL.createObjectURL(content);
    return;
  }

  if (typeof content !== 'string' || !content) {
    throw new Error('Document content is not available.');
  }

  if (/^(https?:|blob:)/i.test(content)) {
    newWindow.location.href = content;
    return;
  }

  const dataUrl = content.startsWith('data:')
    ? content
    : `data:${documentData.documentContentType || 'application/octet-stream'};base64,${content}`;
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error('Unable to read the document content.');
  }

  const blob = await response.blob();
  newWindow.location.href = URL.createObjectURL(blob);
}

export default function ProspectDocument({ prospectId }) {
  const dispatch = useDispatch();
  const { debounceSearchTerm } = useSearch();
  const [requestSearch, setRequestSearch] = useState(debounceSearchTerm);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [viewingDocumentId, setViewingDocumentId] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZE);
  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();

  useEffect(() => {
    if (requestSearch !== debounceSearchTerm) {
      setRequestSearch(debounceSearchTerm);
      if (currentPage !== 1) goToPage(1);
    }
  }, [currentPage, debounceSearchTerm, goToPage, requestSearch]);

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchDocuments = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await ProspectService.getAllProspectDocuments({
          prospectId,
          page: currentPage,
          limit: PAGE_SIZE,
          searchTerm: requestSearch,
        });

        if (!isCurrentRequest) return;

        setDocuments(result.documents);
        setTotalRecords(result.pagination.totalRecords);
        setItemsPerPage(result.pagination.itemsPerPage);
        setTotalPages(result.pagination.totalPages);

        if (result.pagination.currentPage !== currentPage) {
          goToPage(result.pagination.currentPage);
        }
      } catch (requestError) {
        if (!isCurrentRequest) return;

        setDocuments([]);
        setTotalRecords(0);
        setTotalPages(0);
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            'Unable to load prospect documents.'
        );
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };

    fetchDocuments();

    return () => {
      isCurrentRequest = false;
    };
  }, [
    currentPage,
    goToPage,
    prospectId,
    requestSearch,
    retryCount,
    setTotalPages,
  ]);

  const handleView = async (document) => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      dispatch(showToast({
        type: 'error',
        message: 'Please allow pop-ups to view the document.',
      }));
      return;
    }

    try {
      setViewingDocumentId(document.id);
      const documentData = await ProspectService.getProspectDocumentById(document.id);
      await openDocumentContent(documentData, newWindow);

    } catch (viewError) {
      newWindow.close();
      dispatch(showToast({
        type: 'error',
        message:
          viewError.response?.data?.message ||
          viewError.message ||
          'Unable to open the document.',
      }));
    } finally {
      setViewingDocumentId(null);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      setIsDeletingDocument(true);
      const result = await ProspectService.deleteProspectDocument(
        documentToDelete.id
      );
      dispatch(showToast({
        type: 'success',
        message: result?.message || 'Document deleted successfully.',
      }));
      setDocumentToDelete(null);
      setRetryCount((count) => count + 1);
    } catch (deleteError) {
      dispatch(showToast({
        type: 'error',
        message:
          deleteError.response?.data?.message ||
          deleteError.message ||
          'Unable to delete prospect document.',
      }));
    } finally {
      setIsDeletingDocument(false);
    }
  };

  const startRecord =
    totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex flex-col md:flex-row gap-3 md:gap-5 justify-between items-start">
        <div className=''>
            <h2 className="text-sm font-semibold text-slate-800">
            Drawings &amp; Documents
            </h2>
            <p className="mt-1 text-xs text-slate-500">
            Search using the header search field. {totalRecords} document(s)
            </p>
        </div>
        <div className='ml-auto'>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
            >
              <UploadCloud size={15} />
              Upload Drawings
            </button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="m-4 flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      <div className="divide-y divide-slate-300">
        {loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="animate-pulse px-4 py-4">
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
            </div>
          ))
        ) : documents.length > 0 ? (
          documents.map((document) => (
            <article
              key={document.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                <FileText size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="break-words text-slate-800">
                    <span className="text-sm font-semibold">
                        {document.fileName || `Document ${document.id}`}
                    </span>

                    {document.version && (
                        <>
                        <span className="mx-1 text-lg font-bold text-slate-400">·</span>
                        <span className="text-xs font-medium text-slate-500">
                            Version: {document.version}
                        </span>
                        </>
                    )}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {document.category || 'Document'}
                  {' · '}
                  {document.documentContentType || 'Unknown format'}
                  {' · '}
                  Uploaded {formatDate(document.createdAt)}
                  {document.uploader?.name && ` by ${document.uploader.name}`}
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <button
                  type="button"
                  onClick={() => handleView(document)}
                  disabled={viewingDocumentId === document.id}
                  className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-wait disabled:opacity-60"
                >
                  <Eye size={14} />
                  {viewingDocumentId === document.id ? 'Loading...' : 'View'}
                  <ExternalLink size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setDocumentToDelete(document)}
                  disabled={isDeletingDocument}
                  aria-label={`Delete ${document.fileName || 'document'}`}
                  className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="px-4 py-12 text-center">
            <FileText size={30} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No documents found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Documents uploaded for this prospect will appear here.
            </p>
          </div>
        )}
      </div>

      {!loading && totalRecords > 0 && (
        <footer className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {startRecord} - {endRecord} of {totalRecords} documents
          </span>
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              goToPage={goToPage}
              totalPages={totalPages}
            />
          )}
        </footer>
      )}

      <UploadProspectDocumentsModal
        open={isUploadModalOpen}
        prospectId={prospectId}
        onClose={() => setIsUploadModalOpen(false)}
        onUploaded={() => setRetryCount((count) => count + 1)}
      />

      <ConfirmationModal
        open={Boolean(documentToDelete)}
        onClose={() => {
          if (!isDeletingDocument) setDocumentToDelete(null);
        }}
        onConfirm={handleDeleteDocument}
        title="Delete Document"
        message={`Are you sure you want to delete "${
          documentToDelete?.fileName || 'this document'
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeletingDocument}
        variant="danger"
      />
    </section>
  );
}
