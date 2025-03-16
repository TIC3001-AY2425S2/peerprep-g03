import axios from "axios";
import { API_ENDPOINTS } from "../config";
import type { Question } from "../types/Question";

/**
 * Fetch all questions from the API
 */
export const fetchQuestions = async (): Promise<Question[]> => {
  //const response = await axios.get<Question[]>(API_ENDPOINTS.QUESTIONS); //uncomment this and comment the one uncommented if you're using for json server
  //return response.data;
  const response = await axios.get(API_ENDPOINTS.QUESTIONS);
  return response.data.question;
  
};

/**
 * Fetch a single question by ID
 */
export const fetchQuestionById = async (id: number): Promise<Question> => {
  const response = await axios.get<Question>(
    `${API_ENDPOINTS.QUESTIONS}/${id}`
  );
  return response.data;
};

/**
 * Add a new question
 */
export const createQuestion = async (newQuestion: Omit<Question, "id">) => {
  const response = await axios.post<Question>(
    API_ENDPOINTS.QUESTIONS,
    newQuestion
  );
  return response.data;
};

/**
 * Update an existing question
 */
export const updateQuestion = async (
  id: string,
  updatedData: Partial<Question>
) => {
  const response = await axios.put(
    `${API_ENDPOINTS.QUESTIONS}/${id}`,
    updatedData
  );
  return response.data;
};

/**
 * Delete a question
 */
export const deleteQuestion = async (id: string) => {
  const response = await axios.delete(`${API_ENDPOINTS.QUESTIONS}/${id}`);
};
