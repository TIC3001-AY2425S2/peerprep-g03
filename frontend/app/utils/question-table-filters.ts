import type { Question } from "../types/Question";

/**
 * Generates difficulty filters
 */
export const getDifficultyFilters = () => [
  { text: "Easy", value: "Easy" },
  { text: "Medium", value: "Medium" },
  { text: "Hard", value: "Hard" },
];

/**
 * Generates category filters dynamically based on question data
 */
export const getCategoryFilters = (questions: Question[]) => {
  const categorySet = new Set<string>();

  questions.forEach((q) =>{
    if (Array.isArray(q.categories)){
      q.categories.forEach((category) => categorySet.add(category))
    }
  });
  return Array.from(categorySet).map((category) => ({
    text: category,
    value: category,
  }));
};
