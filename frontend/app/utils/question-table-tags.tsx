import { Tag } from "antd";

/**
 * Returns an Ant Design Tag for question difficulty level
 */
export const getDifficultyTag = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return <Tag color="green">Easy</Tag>;
    case "medium":
      return <Tag color="orange">Medium</Tag>;
    case "hard":
      return <Tag color="red">Hard</Tag>;
    default:
      return <Tag>{difficulty}</Tag>;
  }
};

/**
 * Returns a set of Ant Design Tags for question categories
 */
export const getCategoryTags = (categories: string[]) => {
  return (
    <>
      {categories.map((category) => (
        <Tag color="blue" key={category}>
          {category.toUpperCase()}
        </Tag>
      ))}
    </>
  );
};
