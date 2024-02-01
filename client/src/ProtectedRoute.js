import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, Children }) {
    if (!isAuthenticated) return <Navigate to="/user" />;
    return Children ? Children : <Outlet />;
}

export default ProtectedRoute;