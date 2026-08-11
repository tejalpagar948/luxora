import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-background">
                <p className="font-body text-neutral-400">Loading...</p>
            </div>
        );
    }

    if (!user || !user.isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
