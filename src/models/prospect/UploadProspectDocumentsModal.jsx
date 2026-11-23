import { useEffect, useRef, useState } from 'react';
import { FileText, Trash2, UploadCloud, X } from 'lucide-react';
import ProspectService from '@/services/prospectService';

const MAX_FILES = 5;
const ACCEPTED_TYPES = '.pdf,.dwg,.dxf,.jpg,.jpeg,.png';

export default function UploadProspectDocumentsModal({
  open,
  prospectId,
  onClose,
  onUploaded,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSelectedFiles([]);
      setError('');
      setSuccess('');
      setIsUploading(false);
    }
  }, [open, prospectId]);

  if (!open) return null;

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = '';
    setError('');
    setSuccess('');

    const remainingSlots = MAX_FILES - selectedFiles.length;
    if (newFiles.length > remainingSlots) {
      setError(`You can select only ${remainingSlots} more document(s). The maximum is 5.`);
      return;
    }

    setSelectedFiles((currentFiles) => [...currentFiles, ...newFiles]);
  };

  const handleRemoveFile = (fileIndex) => {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== fileIndex)
    );
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (selectedFiles.length === 0) {
      setError('Select at least one document to upload.');
      return;
    }

    try {
      setIsUploading(true);
      const result = await ProspectService.uploadProspectDrawings(
        prospectId,
        selectedFiles
      );
      setSelectedFiles([]);
      setSuccess(result?.message || 'Documents uploaded successfully.');
      onUploaded?.();
    } catch (uploadError) {
      setError(
        uploadError.response?.data?.message ||
          uploadError.message ||
          'Unable to upload documents. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUploading) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-prospect-documents-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2
              id="upload-prospect-documents-title"
              className="text-lg font-semibold text-slate-900"
            >
              Upload Documents
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Upload up to 5 drawings or documents for this prospect.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-5">
            <label
              htmlFor="prospect-document-files"
              className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition ${
                selectedFiles.length >= MAX_FILES
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                  : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-brand-400 hover:bg-brand-50/40'
              }`}
            >
              <UploadCloud size={26} className="mb-2 text-brand-600" />
              <span className="text-sm font-semibold">Choose documents</span>
              <span className="mt-1 text-xs">
                PDF, DWG, DXF, JPG or PNG · Maximum 5 files
              </span>
            </label>
            <input
              ref={inputRef}
              id="prospect-document-files"
              type="file"
              accept={ACCEPTED_TYPES}
              multiple
              disabled={selectedFiles.length >= MAX_FILES || isUploading}
              onChange={handleFileChange}
              className="sr-only"
            />

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700">
                  Selected files ({selectedFiles.length}/{MAX_FILES})
                </p>
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <FileText size={17} className="shrink-0 text-brand-600" />
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() => handleRemoveFile(index)}
                      disabled={isUploading}
                      className="shrink-0 rounded-md p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              >
                {success}
              </p>
            )}
          </div>

          <footer className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isUploading || selectedFiles.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UploadCloud size={16} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
