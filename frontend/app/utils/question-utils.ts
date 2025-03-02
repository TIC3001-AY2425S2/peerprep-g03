import type { Question } from "../types/Question";

/**
 * Extracts unique categories from a list of questions.
 */
export function extractCategories(questions: Question[]): string[] {
  return Array.from(new Set(questions.flatMap((q) => q.categories)));
}
