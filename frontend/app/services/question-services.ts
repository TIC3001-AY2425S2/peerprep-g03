import axios, { AxiosError } from "axios";

import type { ServiceResult } from "~/types/ServiceResult";
import { API_ENDPOINTS } from "../config";
import type {
  CreateQuestionPayload,
  CreateQuestionResponse,
  Question,
  UpdateQuestionPayload,
  UpdateQuestionResponse,
} from "../types/Question";

/**
 * Fetch all questions from the API
 */
export const fetchQuestions = async (): Promise<ServiceResult<Question[]>> => {
  try {
    const response = await axios.get(API_ENDPOINTS.QUESTIONS);
    return {
      success: true,
      data: response.data.question,
      message: "Questions fetched successfully",
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";
    return { success: false, data: null, message: message };
  }
};

/**
 * Fetch a single question by ID
 */
export const fetchQuestionById = async (
  id: string
): Promise<ServiceResult<Question>> => {
  try {
    const response = await axios.get<{ data: Question }>(
      `${API_ENDPOINTS.QUESTIONS}/${id}`
    );
    return {
      success: true,
      data: response.data.data,
      message: "Question retrieved successfully",
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";
    return { success: false, data: null, message: message };
  }
};

/**
 * Fetch all unique categories from the list of questions
 */
export const fetchQuestionCategories = async (): Promise<
  ServiceResult<string[]>
> => {
  try {
    const allResult = await fetchQuestions();
    if (!allResult.success || !allResult.data) {
      return { success: false, data: null, message: allResult.message };
    }

    const categoriesSet = new Set<string>();
    allResult.data.forEach((q) => {
      q.categories.forEach((cat) => categoriesSet.add(cat));
    });

    return {
      success: true,
      data: Array.from(categoriesSet),
      message: "Categories extracted successfully",
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";
    return { success: false, data: null, message: message };
  }
};

/**
 * Add a new question
 */
export const createQuestion = async (
  newQuestion: CreateQuestionPayload
): Promise<ServiceResult<CreateQuestionResponse>> => {
  try {
    const response = await axios.post<Question>(
      API_ENDPOINTS.QUESTIONS,
      newQuestion
    );
    return {
      success: true,
      data: response.data,
      message: "Question created successfully",
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";
    return { success: false, data: null, message: message };
  }
};

/**
 * Update an existing question
 */
export const updateQuestion = async (
  id: string,
  updatedData: UpdateQuestionPayload
): Promise<ServiceResult<UpdateQuestionResponse>> => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.QUESTIONS}/${id}`,
      updatedData
    );
    return {
      success: true,
      data: response.data,
      message: "Question updated successfully",
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";
    return { success: false, data: null, message: message };
  }
};

/**
 * Delete a question
 */
export const deleteQuestion = async (
  id: string
): Promise<ServiceResult<null>> => {
  try {
    await axios.delete(`${API_ENDPOINTS.QUESTIONS}/${id}`);
    return {
      success: true,
      data: null,
      message: "Question deleted successfully",
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";
    return { success: false, data: null, message: message };
  }
};
