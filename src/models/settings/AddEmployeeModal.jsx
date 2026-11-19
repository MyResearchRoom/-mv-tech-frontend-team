
import { useEffect, useState } from 'react';
import { X, UserPlus, Pencil, Eye, EyeOff } from 'lucide-react';

import {
  FormImageUpload,
  FormInput,
  FormSelect,
} from '@/components/common/FormFields';

const employeeRoles = [
  'DESIGN HEAD',
  'INVENTORY MANAGER',
  'PROJECT MANAGER',
  'ACCOUNT MANAGER',
  'CLIENT MANAGER',
];

const genders = ['male', 'female'];

function Section({ number, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-semibold text-white">
          {number}
        </span>

        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Field({ children, span = false }) {
  return <div className={span ? 'sm:col-span-2' : ''}>{children}</div>;
}

export default function AddEmployeeModal({
  open,
  onClose,
  onSubmit,
  employee = null,
  isEdit = false,
}) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setIsSubmitting(false);
      setShowPassword(false);
      setSelectedProfileFile(null);
    }
  }, [open, employee?.id]);

  useEffect(() => {
    if (!selectedProfileFile) {
      setProfilePreviewUrl(
        typeof employee?.profile === 'string' ? employee.profile : ''
      );
      return undefined;
    }

    const previewUrl = URL.createObjectURL(selectedProfileFile);
    setProfilePreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [employee?.profile, selectedProfileFile]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const formData = new FormData(form);

    const employeePayload = {
      name: formData.get('name')?.trim() || '',
      email: formData.get('email')?.trim().toLowerCase() || '',
      mobileNumber: formData.get('mobileNumber')?.trim() || '',
      role: formData.get('role') || '',
      gender: formData.get('gender') || null,
      profile: selectedProfileFile?.size ? selectedProfileFile : null,
    };

    if (!isEdit) {
      employeePayload.password = formData.get('password') || '';
    }

    if (!employeePayload.name) {
      setError('Please enter employee name.');
      return;
    }

    if (!employeePayload.role) {
      setError('Please select an employee role.');
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await onSubmit?.(employeePayload);

      // Keep modal open if API validation or submission fails.
      if (result === false) return;

      form.reset();
      setError('');
      onClose?.();
    } catch (submitError) {
      setError(
        submitError?.message || 'Unable to save employee details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-brand-600">
              EMPLOYEE MANAGEMENT
            </p>

            <h1
              id="employee-modal-title"
              className="mt-1 text-xl font-semibold text-slate-900"
            >
              {isEdit ? 'Edit Employee' : 'Add New Employee'}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              {isEdit
                ? 'Update employee details and account information.'
                : 'Add employee details and configure their account access.'}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </header>

        {/* Form */}
        <form
          key={`${isEdit ? 'edit' : 'add'}-${employee?.id || 'new'}`}
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="thin-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
            <Section
              number="1"
              title="Employee Details"
              subtitle="Basic personal and contact information"
            >
              <Field>
                <FormInput
                  label="Employee Name"
                  name="name"
                  placeholder="Enter employee name"
                  defaultValue={employee?.name || ''}
                  required
                  minLength={2}
                />
              </Field>

              <Field>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="employee@example.com"
                  defaultValue={employee?.email || ''}
                  required
                />
              </Field>

              <Field>
                <FormInput
                  label="Mobile Number"
                  name="mobileNumber"
                  type="tel"
                  placeholder="Enter mobile number"
                  defaultValue={employee?.mobileNumber || ''}
                  required
                  pattern="[0-9]{10}"
                  title="Mobile number must contain exactly 10 digits"
                />
              </Field>

              <Field>
                <FormSelect
                  label="Role"
                  name="role"
                  required
                  options={employeeRoles}
                  defaultValue={employee?.role || ''}
                />
              </Field>

              <Field>
                <FormSelect
                  label="Gender"
                  name="gender"
                  options={genders}
                  defaultValue={employee?.gender || ''}
                />
              </Field>

              {!isEdit && (
                <Field>
                  <div className="relative">
                    <FormInput
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      title="Password must contain at least 8 characters"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-2 top-[31px] rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </Field>
              )}

              <Field span>
                <FormImageUpload
                  label="Employee Profile Image"
                  name="profile"
                  accept="image/png,image/jpeg,image/jpg"
                  imageLabel="profile picture"
                  previewUrl={profilePreviewUrl}
                  fileName={selectedProfileFile?.name}
                  onChange={setSelectedProfileFile}
                  hint={
                    isEdit
                      ? 'Optional: upload a new image to replace the existing profile image.'
                      : 'Optional: upload PNG or JPG image.'
                  }
                />
              </Field>
            </Section>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <p className="text-[11px] text-slate-500">
              Fields marked with an asterisk are required.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isEdit ? <Pencil size={16} /> : <UserPlus size={16} />}
                {isSubmitting
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Employee'
                    : 'Add Employee'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
