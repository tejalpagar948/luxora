import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserOnlyRoute = () => {
    const { user } = useAuth();

    if (user?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default UserOnlyRoute;