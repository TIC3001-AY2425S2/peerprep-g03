import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtPayload";

const TOKEN_KEY = "token";

/**
 * Save JWT token to localStorage
 */
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token from localStorage
 */
export const deleteToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if token exists
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * Get user ID from token
 */
export const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.id;
  } catch {
    return null;
  }
};
