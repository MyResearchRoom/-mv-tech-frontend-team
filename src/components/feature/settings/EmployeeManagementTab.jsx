
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  UserPlus,
  Eye,
  Pencil,
  Power,
  Trash2,
} from 'lucide-react';
import { useDispatch } from 'react-redux';

import ConfirmationModal from '@/components/common/ConfirmationModal';

import Pagination from '@/components/common/Pagination';
import AddEmployeeModal from '@/models/settings/AddEmployeeModal';
import AuthService from '@/services/authService';
import TableComponent from '@/components/common/tableComponent';
import { EmptyState } from './settingsHelpers';
import { showToast } from '@/store/slices/uiSlice';
import { cn } from '@/utils/helpers';
import { useSearch } from '@/context/SearchContext';
import { usePagination } from '@/hooks/usePagination';

const PAGE_SIZE = 10;

const allowedRoles = [
  'ADMIN',
  'DESIGN HEAD',
  'INVENTORY MANAGER',
  'PROJECT MANAGER',
  'ACCOUNT MANAGER',
  'CLIENT MANAGER',
];

const filterRoles = allowedRoles.filter((role) => role !== 'ADMIN');

function ActionButton({
  children,
  title,
  onClick,
  className,
  disabled = false,
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg border text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
}

function EmployeeAvatar({ name = '' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
      {initials || '—'}
    </div>
  );
}

function EmployeeStatus({ active }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold',
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-slate-100 text-slate-500'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          active ? 'bg-emerald-600' : 'bg-slate-400'
        )}
      />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function validateEmployee(employee) {
  if (
    !employee.name ||
    !employee.email ||
    !employee.mobileNumber ||
    !employee.role ||
    !employee.password
  ) {
    return 'Please fill in all required fields.';
  }

  if (!/^\d{10}$/.test(employee.mobileNumber)) {
    return 'Mobile number must contain exactly 10 digits.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
    return 'Please enter a valid email address.';
  }

  if (!allowedRoles.includes(employee.role)) {
    return 'Please select a valid employee role.';
  }

  if (employee.password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  if (!/[a-z]/.test(employee.password)) {
    return 'Password must include a lowercase letter.';
  }

  if (!/[A-Z]/.test(employee.password)) {
    return 'Password must include an uppercase letter.';
  }

  if (!/\d/.test(employee.password)) {
    return 'Password must include a digit.';
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(employee.password)) {
    return 'Password must include a special character.';
  }

  if (
    employee.gender &&
    !['male', 'female'].includes(employee.gender)
  ) {
    return 'Please select a valid gender.';
  }

  return null;
}

function getErrorMessage(error) {
  const responseData = error?.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length) {
    return responseData.errors
      .map((item) => item.msg || item.message)
      .filter(Boolean)
      .join(', ');
  }

  return (
    responseData?.message ||
    error?.message ||
    'Unable to add employee. Please try again.'
  );
}

export default function EmployeeManagementTab({
  onAddEmployee,
  onViewEmployee,
  onEditEmployee,
  onToggleEmployeeStatus,
}) {
  const dispatch = useDispatch();

  const { debounceSearchTerm } = useSearch();
  const [requestSearch, setRequestSearch] = useState(debounceSearchTerm);

  const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZE);
    const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();

  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  // const [totalPages, setTotalPages] = useState(1);

  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (requestSearch !== debounceSearchTerm) {
      setRequestSearch(debounceSearchTerm);
      if (currentPage !== 1) goToPage(1);
    }
  }, [currentPage, debounceSearchTerm, goToPage, requestSearch]);

  // Fetch employees from backend
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: PAGE_SIZE,
        searchTerm: requestSearch,
        role: roleFilter,
      };

      // Send active only when a specific status is selected.
      if (statusFilter !== 'all') {
        params.active = statusFilter;
      }

      const response = await AuthService.getAllEmployees(params);

      if (response?.success) {
        setEmployees(response.data || []);
        setTotalRecords(response.pagination?.totalRecords || 0);
        setTotalPages(response.pagination?.totalPages || 1);
        setItemsPerPage(response.pagination.itemsPerPage);
        if (response.pagination.currentPage !== currentPage) {
          goToPage(response.pagination.currentPage);
        }
      } else {
        setEmployees([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(
        'Get Employees Error:',
        error?.response?.data || error
      );

      dispatch(
        showToast({
          type: 'error',
          message:
            error?.response?.data?.message ||
            'Failed to fetch employees.',
        })
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, roleFilter, statusFilter,requestSearch, dispatch]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Add employee API
  const handleAddEmployee = async (employeeData) => {
    if (isSubmitting) return false;

    const payload = {
      name: employeeData.name?.trim() || '',
      email: employeeData.email?.trim().toLowerCase() || '',
      mobileNumber: employeeData.mobileNumber?.replace(/\D/g, '') || '',
      role: employeeData.role?.trim() || '',
      gender: employeeData.gender || '',
      password: employeeData.password || '',
      profile: employeeData.profile || null,
    };

    const validationError = validateEmployee(payload);

    if (validationError) {
      dispatch(
        showToast({
          type: 'error',
          message: validationError,
        })
      );

      return false;
    }

    try {
      setIsSubmitting(true);

      const response = await AuthService.employeeRegistration(payload);

      if (!response?.success) {
        throw new Error(
          response?.message || 'Unable to register employee.'
        );
      }

      // Refresh the employee list after successful creation.
      setCurrentPage(1);

      // If already on page 1, fetch immediately.
      if (currentPage === 1) {
        await fetchEmployees();
      }

      onAddEmployee?.(payload);

      dispatch(
        showToast({
          type: 'success',
          message: response.message || 'Employee added successfully.',
        })
      );

      setShowEmployeeForm(false);

      return true;
    } catch (error) {
      console.error('Add Employee Status:', error?.response?.status);
      console.error('Add Employee Response:', error?.response?.data);
      console.error('Add Employee Error:', error);

      dispatch(
        showToast({
          type: 'error',
          message: getErrorMessage(error),
        })
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditMode(true);
    setShowEmployeeForm(true);
  };

  const handleEditEmployee = async (employeeData) => {
    if (!selectedEmployee?.id) return false;

    const payload = {
      name: employeeData.name.trim(),
      email: employeeData.email.trim().toLowerCase(),
      mobileNumber: employeeData.mobileNumber.replace(/\D/g, ''),
      role: employeeData.role,
      gender: employeeData.gender || null,
      profile: employeeData.profile || null,
    };

    try {
      const response = await AuthService.editEmployee(
        selectedEmployee.id,
        payload
      );

      if (!response?.success) {
        throw new Error(response?.message || 'Unable to update employee.');
      }

      await fetchEmployees();

      dispatch(
        showToast({
          type: 'success',
          message: response.message || 'Employee updated successfully.',
        })
      );

      setSelectedEmployee(null);
      setIsEditMode(false);

      return true;
    } catch (error) {
      dispatch(
        showToast({
          type: 'error',
          message: getErrorMessage(error),
        })
      );

      return false;
    }
  };

  const handleToggleStatus = async (employee) => {
    try {
      const response = await AuthService.changeEmployeeActiveStatus(
        employee.id
      );

      if (!response?.success) {
        throw new Error(
          response?.message || 'Unable to update employee status.'
        );
      }

      // Refresh employee list after status update.
      await fetchEmployees();

      dispatch(
        showToast({
          type: 'success',
          message: response.message || 'Employee status updated successfully.',
        })
      );
    } catch (error) {
      console.error(
        'Change Employee Status Error:',
        error?.response?.data || error
      );

      dispatch(
        showToast({
          type: 'error',
          message:
            error?.response?.data?.message ||
            error?.message ||
            'Failed to update employee status.',
        })
      );
    }
  };

  const handleRoleChange = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (employee) => {
  setEmployeeToDelete(employee);
};

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete?.id) return;

    try {
      setIsDeleting(true);

      const response = await AuthService.deleteEmployee(employeeToDelete.id);

      if (!response?.success) {
        throw new Error(response?.message || 'Unable to delete employee.');
      }

      dispatch(
        showToast({
          type: 'success',
          message: response.message || 'Employee deleted successfully.',
        })
      );

      setEmployeeToDelete(null);

      // Move to the previous page if this was the only record on the page.
      if (employees.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchEmployees();
      }
    } catch (error) {
      dispatch(
        showToast({
          type: 'error',
          message:
            error?.response?.data?.message ||
            error?.message ||
            'Failed to delete employee.',
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        label: 'Employee',
        field: 'name',
        width: '28%',
        className: 'text-left',
        headerClassName: 'text-left',
        render: (employee) => (
          <div className="flex min-w-0 items-center gap-2 text-left">
            <p className="max-w-[150px] truncate text-xs font-semibold text-slate-800">
              {employee.name || '—'}
            </p>
          </div>
        ),
      },
      {
        label: 'Contact Details',
        width: '23%',
        className: 'text-left',
        headerClassName: 'text-left',
        render: (employee) => (
          <div className="min-w-0 text-left">
            <p className="truncate text-xs font-medium text-slate-700">
              {employee.email || '—'}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {employee.mobileNumber || '—'}
            </p>
          </div>
        ),
      },
      {
        label: 'Role',
        width: '16%',
        render: (employee) => (
          <span className="inline-flex max-w-full rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
            {employee.role || '—'}
          </span>
        ),
      },
      {
        label: 'Gender',
        width: '9%',
        render: (employee) => (
          <span className="text-xs capitalize text-slate-600">
            {employee.gender || '—'}
          </span>
        ),
      },
      {
        label: 'Status',
        width: '14%',
        render: (employee) => (
          <EmployeeStatus active={employee.active} />
        ),
      },
      {
        label: 'Actions',
        width: '16%',
        render: (employee) => (
          <div className="flex items-center gap-1.5">
            <ActionButton
              title="Edit employee"
              onClick={() => handleEdit(employee)}
              className="w-8 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <Pencil size={14} />
            </ActionButton>

            <ActionButton
              title={employee.active ? 'Deactivate' : 'Activate'}
              onClick={() => handleToggleStatus(employee)}
              className={cn(
                'w-8',
                employee.active
                  ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              )}
            >
              <Power size={14} />
            </ActionButton>
            
          <ActionButton
            title="Delete Employee"
            onClick={() => handleDeleteClick(employee)}
            className="w-8 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          >
            <Trash2 size={14} />
          </ActionButton>

          </div>
        ),
      },
    ],
    [onViewEmployee, onEditEmployee, onToggleEmployeeStatus]
  );

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-2 md:p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Employee Management
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage employee details and account access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowEmployeeForm(true)}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:opacity-60"
          >
            <UserPlus size={15} />
             New Employee
          </button>
        </div>

        {/* Employee List */}
        <div className="p-4 sm:p-5">
          {/* Filters */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-col gap-1.5 sm:w-48">


              <select
                id="employee-role-filter"
                value={roleFilter}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="all">All Roles</option>
                {filterRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:w-40">

              <select
                id="employee-status-filter"
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading employees...
            </div>
          ) : employees.length === 0 ? (
            <EmptyState
              title="No employees found"
              description="No employees match the selected filters. Try changing the filters or add a new employee."
            />
          ) : (
            <>

              <div className="hidden w-full md:block">
                <TableComponent
                  columns={columns}
                  data={employees}
                  loading={loading}
                />
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="rounded-xl border border-slate-200 bg-white p-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {/* <EmployeeAvatar name={employee.name || ''} /> */}

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-800 capitalize">
                            {employee.name || '—'}
                          </h3>
                          
                        </div>
                      </div>

                      <EmployeeStatus active={employee.active} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                          Mobile Number
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {employee.mobileNumber || '—'}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                          Role
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {employee.role || '—'}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                          Email
                        </p>
                        <p className="mt-1 text-xs text-slate-700 break-all ">
                          {employee.email || '—'}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                          Gender
                        </p>
                        <p className="mt-1 text-xs capitalize text-slate-700">
                          {employee.gender || '—'}
                        </p>
                      </div>

                      {/* <p className="mt-0.5 truncate text-xs text-slate-500">
                            {employee.email || '—'}
                        </p> */}
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">

                      <ActionButton
                        title="Edit employee"
                        onClick={() => handleEdit(employee)}
                        className="w-auto border-blue-200 bg-blue-50 px-3 text-blue-700 hover:bg-blue-100"
                      >
                        <Pencil size={14} />
                      </ActionButton>

                      <ActionButton
                        title={employee.active ? 'Deactivate' : 'Activate'}
                        onClick={() => handleToggleStatus(employee)}
                        className={cn(
                          'w-auto gap-1.5 px-3',
                          employee.active
                            ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        )}
                      >
                        <Power size={14} />
                      </ActionButton>

                    <ActionButton
                      title="Delete Employee"
                      onClick={() => handleDeleteClick(employee)}
                      className="w-8 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                    </ActionButton>

                    </div>
                    
                  </div>
                ))}
              </div>

              {/* Pagination */}
               <div className="mt-5 flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Showing 
                  {/* {(currentPage - 1) * itemsPerPage + 1}
                  {' - '} */}
                  {employees.length ? (currentPage - 1) * itemsPerPage + 1 : 0}
                  {' - '}
                  {Math.min(currentPage * itemsPerPage, totalRecords)}
                  {' of '}
                  {totalRecords}
                </p>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                />
              </div>

            </>
          )}
        </div>
      </section>

   
     <AddEmployeeModal
      open={showEmployeeForm}
      employee={isEditMode ? selectedEmployee : null}
      isEdit={isEditMode}
      onClose={() => {
        if (!isSubmitting) {
          setShowEmployeeForm(false);
          setSelectedEmployee(null);
          setIsEditMode(false);
        }
      }}
      onSubmit={isEditMode ? handleEditEmployee : handleAddEmployee}
    />

  <ConfirmationModal
    open={!!employeeToDelete}
    onClose={() => {
      if (!isDeleting) setEmployeeToDelete(null);
    }}
    onConfirm={handleDeleteEmployee}
    title="Delete Employee"
    message={`Are you sure you want to delete ${
      employeeToDelete?.name || 'this employee'
    }? This action cannot be undone.`}
    confirmText="Delete"
    cancelText="Cancel"
    isLoading={isDeleting}
  />
    </>
  );
}
