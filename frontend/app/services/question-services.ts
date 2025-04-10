import axios from "axios";
import { API_ENDPOINTS } from "../config";
import type { Question } from "../types/Question";

/**
 * Fetch all questions from the API
 */
export const fetchQuestions = async (): Promise<Question[]> => {
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
 * Fetch all unique categories from the list of questions
 */
export const fetchQuestionCategories = async (): Promise<string[]> => {
  const allQuestions = await fetchQuestions();
  const categoriesSet = new Set<string>();

  allQuestions.forEach((q) => {
    q.categories.forEach((cat) => categoriesSet.add(cat));
  });

  return Array.from(categoriesSet);
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
  await axios.delete(`${API_ENDPOINTS.QUESTIONS}/${id}`);
};
