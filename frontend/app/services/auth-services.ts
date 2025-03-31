import axios, { AxiosError } from "axios";
import { API_ENDPOINTS } from "../config";

/**
 * Register a new user
 */
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.AUTH_REGISTER}`,
      userData
    );

    if (response.status === 201 && response.data?.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "User registered successfully",
      };
    } else {
      return {
        success: false,
        data: null,
        message: response.data?.message || "Unexpected response format",
      };
    }
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";

    return { success: false, data: null, message };
  }
};

/**
 * Login user and retrieve JWT token
 */
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.AUTH_LOGIN}`,
      credentials
    );

    if (response.status === 200 && response.data?.data?.accessToken) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        data: null,
        message: response.data?.message || "Unexpected response format",
      };
    }
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";

    return { success: false, data: null, message };
  }
};

/**
 * Verify JWT token validity
 */
export const verifyToken = async (token: string) => {
  const response = await axios.get(API_ENDPOINTS.AUTH_VERIFY, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
