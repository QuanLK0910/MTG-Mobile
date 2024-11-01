import { useAuth } from '../contexts/AuthContext';
import { Redirect } from 'expo-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'manager' | 'staff' | 'customer')[];
}

export function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isManager, isStaff, isCustomer } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const hasAllowedRole = allowedRoles.some(role => {
    switch (role) {
      case 'admin': return isAdmin();
      case 'manager': return isManager();
      case 'staff': return isStaff();
      case 'customer': return isCustomer();
      default: return false;
    }
  });

  if (!hasAllowedRole && allowedRoles.length > 0) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}
