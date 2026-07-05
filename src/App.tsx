import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { PublicOnlyRoute } from "@/routes/PublicOnlyRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { paths } from "@/routes/paths";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { WalletsPage } from "@/pages/WalletsPage";
import { WalletDetailPage } from "@/pages/WalletDetailPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ChangePasswordPage } from "@/pages/ChangePasswordPage";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Public: visitors only (if logged in, redirect to the dashboard). */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.register} element={<RegisterPage />} />
          <Route path={paths.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={paths.resetPassword} element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* Protected: require a session. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={paths.dashboard} element={<DashboardPage />} />
          <Route path={paths.wallets} element={<WalletsPage />} />
          <Route path={paths.walletDetail} element={<WalletDetailPage />} />
          <Route path={paths.profile} element={<ProfilePage />} />
          <Route path={paths.changePassword} element={<ChangePasswordPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={paths.dashboard} replace />} />
      <Route path="*" element={<Navigate to={paths.login} replace />} />
    </Routes>
  );
}

export default App;
