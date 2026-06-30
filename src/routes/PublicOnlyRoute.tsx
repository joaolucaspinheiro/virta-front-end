import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import { FullScreenLoader } from "@/components/FullScreenLoader";

/** Visitor-only routes (login, sign-up...). If already logged in, go to dashboard. */
export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to={paths.dashboard} replace />;
  return <Outlet />;
}
