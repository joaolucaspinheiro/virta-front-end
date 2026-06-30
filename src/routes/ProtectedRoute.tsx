import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import { FullScreenLoader } from "@/components/FullScreenLoader";

/** Guards authenticated routes; redirects to /login keeping the origin. */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
