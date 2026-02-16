import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../../services/auth';

export default function PrivateRoute({ children }) {
  return isAdminAuthenticated() ? children : <Navigate to="/admin" />;
}