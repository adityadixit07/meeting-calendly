import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute({ isAdmin, Children }) {
  if (!isAdmin) return <Navigate to="/admin" />;
  return Children ? Children : <Outlet />;
}

export default AdminRoute;