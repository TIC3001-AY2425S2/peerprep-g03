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
      const data = await fetchQuestions();
      setQuestions(data);
      setFilteredQuestions(data);
      setCategories(extractCategories(data));
    } catch (error) {
      console.error("Failed to fetch questions", error);
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
      let updatedQuestions;
      if (selectedQuestion) {
        // Update existing question
        const retrievedQn = await updateQuestion(
          selectedQuestion._id,
          newQuestion
        );
        updatedQuestions = questions.map((q) =>
          q._id === retrievedQn._id ? retrievedQn : q
        );
      } else {
        // Create new question
        const createdQuestion = await createQuestion(newQuestion);
        updatedQuestions = [...questions, createdQuestion];
      }
      setQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
      setCategories(extractCategories(updatedQuestions));
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving question", error);
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
    } catch (error) {
      console.error("Error deleting question", error);
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
