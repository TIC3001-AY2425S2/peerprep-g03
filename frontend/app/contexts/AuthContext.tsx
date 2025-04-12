import { App } from "antd";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

import { loginUser as apiLoginUser } from "../services/auth-services";
import type { AuthContext } from "../types/AuthContext";
import type { JwtPayload } from "../types/JwtPayload";
import type { LoginPayload } from "../types/User";

import {
  deleteToken,
  getToken,
  isTokenExpired,
  saveToken,
} from "../utils/auth-utils";

const AuthContext = createContext<AuthContext | undefined>(undefined);

// AuthProvider wraps your app and provides auth state to all children
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { message } = App.useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [jwtPayload, setJwtPayload] = useState<JwtPayload | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  // Check if token exists and is still valid
  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      const decodedJwtPayload = jwtDecode<JwtPayload>(token);
      setJwtPayload(decodedJwtPayload);
      setIsAuthenticated(true);
    } else {
      deleteToken();
      setJwtPayload(null);
      setIsAuthenticated(false);
    }
    setIsAuthInitialized(true);
  }, []);

  // Set up a timer to auto-logout when token expires
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getToken();
      if (token && isTokenExpired(token)) {
        logoutUser();
        message.info("Session expired. Please login again.");
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loginUser = async (credentials: {
    email: string;
    password: string;
  }) => {
    const result = await apiLoginUser(credentials);
    if (result.success && result.data?.accessToken) {
      saveToken(result.data.accessToken);

      const decodedJwtPayload = jwtDecode<JwtPayload>(result.data.accessToken);
      setJwtPayload(decodedJwtPayload);
      setIsAuthenticated(true);
    }
    return result;
  };

  // Clear session and auth state
  const logoutUser = () => {
    deleteToken();
    setJwtPayload(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthInitialized,
        jwtPayload: jwtPayload,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume AuthContext safely
export const useAuth = (): AuthContext => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
