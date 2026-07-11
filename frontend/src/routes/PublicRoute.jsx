import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null
    }

    if (user) {
        return <Navigate to="/app" replace />;
    }

    return <Outlet />
}