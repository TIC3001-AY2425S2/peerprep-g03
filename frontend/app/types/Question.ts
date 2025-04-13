/**
 * Represents a coding question in the system.
 */
export interface Question {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  complexity: "Easy" | "Medium" | "Hard";
}

export type CreateQuestionPayload = Question;
export type CreateQuestionResponse = Question;

export type UpdateQuestionPayload = Partial<Omit<Question, "_id">>;
export type UpdateQuestionResponse = Question;
