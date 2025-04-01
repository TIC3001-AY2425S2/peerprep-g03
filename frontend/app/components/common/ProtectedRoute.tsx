import { Spin } from "antd";
import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated, isAuthInitialized } = useAuth();

  if (!isAuthInitialized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin tip="Loading..." size="large">
          <div style={{ height: 100 }} />
        </Spin>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
