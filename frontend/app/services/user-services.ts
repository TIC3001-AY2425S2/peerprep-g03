import axios, { AxiosError } from "axios";

import type { ServiceResult } from "~/types/ServiceResult";
import { API_ENDPOINTS } from "../config";
import type {
  GetUserByIdResponse,
  UpdateUserPayload,
  UpdateUserResponse,
} from "../types/User";
import { getToken } from "../utils/auth-utils";

/**
 * Get a single user's data by ID
 * Requires a valid JWT token in the Authorization header.
 */
export const getUserById = async (
  userId: string
): Promise<ServiceResult<GetUserByIdResponse>> => {
  try {
    const token = getToken();
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${API_ENDPOINTS.USERS}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "User data retrieved successfully",
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

    return { success: false, data: null, message: message };
  }
};

/**
 * Update a user's data by ID
 * Requires a valid JWT token in the Authorization header.
 */
export const updateUser = async (
  userId: string,
  updateData: UpdateUserPayload
): Promise<ServiceResult<UpdateUserResponse>> => {
  try {
    const token = getToken();
    if (!token) throw new Error("No access token found");

    const response = await axios.patch(
      `${API_ENDPOINTS.USERS}/${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 && response.data?.data) {
      return {
        success: true,
        data: response.data.data,
        message:
          response.data.message ||
          `User ${response.data.data.username} updated successfully.`,
      };
    } else {
      return {
        success: false,
        data: null,
        message: response.data?.message || "Unexpected response format.",
      };
    }
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong.";

    return { success: false, data: null, message: message };
  }
};

export const deleteUser = async (
  userId: string
): Promise<ServiceResult<null>> => {
  const token = getToken();
  if (!token) throw new Error("No access token found");

  try {
    const response = await axios.delete(`${API_ENDPOINTS.USERS}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data) {
      return {
        success: true,
        data: null,
        message: response.data.message || "User deleted successfully",
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

    return { success: false, data: null, message: message };
  }
};
