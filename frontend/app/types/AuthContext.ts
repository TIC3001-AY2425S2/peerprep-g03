import type { ServiceResult } from "~/types/ServiceResult";
import type { LoginPayload, LoginResponse } from "../types/User";
import type { JwtPayload } from "./JwtPayload";

export interface AuthContext {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  jwtPayload: JwtPayload | null;
  loginUser: (
    credentials: LoginPayload
  ) => Promise<ServiceResult<LoginResponse>>;
  logoutUser: () => void;
}
