import { App } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";

import QuestionModal from "../components/questions/QuestionModal";
import QuestionTable from "../components/questions/QuestionTable";
import QuestionTableHeader from "../components/questions/QuestionTableHeader";
import {
  createQuestion,
  deleteQuestion,
  fetchQuestions,
  updateQuestion,
} from "../services/question-services";
import type { Question } from "../types/Question";
import { extractCategories } from "../utils/question-utils";

export default function QuestionContent() {
  const { message } = App.useApp();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: [5, 10, 20, 50, 100],
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const result = await fetchQuestions();
      if (!result.success || !Array.isArray(result.data)) {
        console.error("Invalid questions data:", result);
        message.error("Failed to load questions. Please try again.");
        return;
      }

      setQuestions(result.data);
      setFilteredQuestions(result.data);
      setCategories(extractCategories(result.data));
    } catch (error) {
      console.error("Failed to fetch questions", error);
      message.error(
        "An unexpected error occurred. Please refresh and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setModalVisible(true);
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setModalVisible(true);
  };

  const handleSaveQuestion = async (newQuestion: Question) => {
    setLoading(true);
    try {
      let updatedQuestions: Question[] = [];
      if (selectedQuestion) {
        // Update existing question
        const result = await updateQuestion(selectedQuestion._id, newQuestion);
        if (result.success && result.data) {
          updatedQuestions = questions.map((q) =>
            q._id === result.data!._id ? result.data! : q
          );
          message.success("Question updated successfully.");
        } else {
          message.error(result.message || "Failed to update question.");
          return;
        }
      } else {
        // Create new question
        const result = await createQuestion(newQuestion);
        if (result.success && result.data) {
          updatedQuestions = [...questions, result.data];
          message.success("Question created successfully.");
        } else {
          message.error(result.message || "Failed to create question.");
          return;
        }
      }
      setQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
      setCategories(extractCategories(updatedQuestions));
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving question", error);
      message.error("Failed to save question.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    setLoading(true);
    try {
      await deleteQuestion(id);
      const updatedQuestions = questions.filter((q) => q._id !== id);
      setQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
      setCategories(extractCategories(updatedQuestions));
      message.success("Question deleted successfully.");
    } catch (error) {
      console.error("Error deleting question", error);
      message.error("Failed to delete question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setFilteredQuestions(questions);
      return;
    }

    const filtered = questions.filter((question) =>
      question.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredQuestions(filtered);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination(paginationConfig);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <QuestionTableHeader
        searchText={searchText}
        setSearchText={setSearchText}
        onSearch={handleSearch}
        onAddQuestion={handleAddQuestion}
      />
      <QuestionTable
        questions={filteredQuestions}
        pagination={pagination}
        loading={loading}
        onDelete={handleDeleteQuestion}
        onEdit={handleEditQuestion}
        onPaginationChange={handleTableChange}
      />
      <QuestionModal
        open={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveQuestion}
        question={selectedQuestion}
        categories={categories}
      />
    </div>
  );
}
