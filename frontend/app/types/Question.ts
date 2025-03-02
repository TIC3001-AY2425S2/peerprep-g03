/**
 * Represents a coding question in the system.
 */
export interface Question {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  complexity: "Easy" | "Medium" | "Hard";
  //link?: string;
}
