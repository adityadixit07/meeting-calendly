import { Navigate, Outlet } from 'react-router-dom';

function ClientProtectedRoute({ isClient, Children }) {
    if (!isClient) return <Navigate to="/" />;
    return Children ? Children : <Outlet />;
}

export default ClientProtectedRoute;