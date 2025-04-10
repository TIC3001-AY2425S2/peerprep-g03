export const USER_SVC_BASE_URL = "http://localhost:4001";
export const QUESTION_SVC_BASE_URL = "http://localhost:4000/api";

export const API_ENDPOINTS = {
  AUTH_REGISTER: `${USER_SVC_BASE_URL}/users`,
  AUTH_LOGIN: `${USER_SVC_BASE_URL}/auth/login`,
  AUTH_VERIFY: `${USER_SVC_BASE_URL}/auth/verify-token`,
  USERS: `${USER_SVC_BASE_URL}/users`,
  QUESTIONS: `${QUESTION_SVC_BASE_URL}/questions`,
};
