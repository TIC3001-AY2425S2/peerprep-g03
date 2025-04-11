import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser as apiLoginUser } from "../services/auth-services";
import type { AuthContextType } from "../types/AuthContextType";
import type { UserSession } from "../types/UserSession";
import {
  deleteToken,
  getToken,
  isTokenExpired,
  saveToken,
} from "../utils/auth-utils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      const decoded = jwtDecode<UserSession>(token);
      setUserSession(decoded);
      setIsAuthenticated(true);
    } else {
      deleteToken();
      setUserSession(null);
      setIsAuthenticated(false);
    }
    setIsAuthInitialized(true);
  }, []);

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

      const decoded = jwtDecode<UserSession>(result.data.accessToken);
      setUserSession(decoded);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const logoutUser = () => {
    deleteToken();
    setUserSession(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthInitialized,
        userSession,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
