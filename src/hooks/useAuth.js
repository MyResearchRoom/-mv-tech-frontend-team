import { useSelector } from 'react-redux';
import { getRoleById } from '@/constants/roles';

export default function useAuth() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const role = user ? getRoleById(user.roleId) : null;
  return { isAuthenticated, user, role };
}
