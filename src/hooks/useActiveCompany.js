import { useSelector } from 'react-redux';

export default function useActiveCompany() {
  const { companies, activeCompanyId } = useSelector((s) => s.company);
  const activeCompany =
    companies.find((company) => String(company.id) === String(activeCompanyId)) ||
    companies[0] ||
    null;
  return { companies, activeCompany };
}
