import type { TableColumnsType } from "antd";
import { Table } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { Key } from "antd/es/table/interface";

import { DIFFICULTY_ORDER } from "../../constant";
import type { Question } from "../../types/Question";
import {
  getCategoryFilters,
  getDifficultyFilters,
} from "../../utils/question-table-filters";
import {
  getCategoryTags,
  getDifficultyTag,
} from "../../utils/question-table-tags";
import QuestionTableActions from "./QuestionTableActions";

interface Props {
  questions: Question[];
  pagination: TablePaginationConfig;
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (question: Question) => void;
  onPaginationChange: (pagination: TablePaginationConfig) => void;
}

export default function QuestionTable({
  questions,
  pagination,
  loading,
  onDelete,
  onEdit,
  onPaginationChange,
}: Props) {
  const columns: TableColumnsType<Question> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      filters: getCategoryFilters(questions),
      filterMultiple: true,
      onFilter: (value: Key | boolean, record: Question) =>
        record.categories.includes(value as string),
      render: (categories: string[]) => getCategoryTags(categories),
    },
    {
      title: "Difficulty",
      dataIndex: "complexity",
      key: "complexity",
      filters: getDifficultyFilters(),
      filterMultiple: true,
      onFilter: (value: Key | boolean, record: Question) =>
        record.complexity.includes(value as string),
      sorter: (a, b) =>
        DIFFICULTY_ORDER.indexOf(a.complexity) -
        DIFFICULTY_ORDER.indexOf(b.complexity),
      sortDirections: ["ascend", "descend"],
      render: (complexity: string) => getDifficultyTag(complexity),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Question) => (
        <QuestionTableActions
          id={record._id}
          question={record}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={questions}
      rowKey="_id"
      pagination={pagination}
      loading={loading}
      onChange={(paginationConfig) => onPaginationChange(paginationConfig)}
    />
  );
}
