import { Navigate, useLocation } from "react-router-dom";
import { getToken, getTokenProperties, compareRole } from "../helpers/useToken";

const ProtectedRoute = ({ children, roles }) => {
    const location = useLocation();
    const token = getToken();
    const role = getTokenProperties("role");
    if (!token) {
        return <Navigate to={`/login?redirectUri=${location.pathname}`} />;
    } else if (roles) {
        const isAccepted = compareRole(roles, role);
        if (!isAccepted) {
            return <Navigate to={`/login?redirectUri=${location.pathname}`} />
        }
    }
    return children;
};

export default ProtectedRoute;