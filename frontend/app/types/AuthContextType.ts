import type { UserSession } from "./UserSession";

export interface AuthContextType {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  userSession: UserSession | null;
  loginUser: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logoutUser: () => void;
}
