import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";

import type { Question } from "../../types/Question";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  question: Question | null;
  categories: string[];
}

export default function QuestionModal({
  open,
  onClose,
  onSave,
  question,
  categories,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (question) {
      form.setFieldsValue(question);
    } else if (open) {
      form.resetFields();
    }
  }, [question, form, open]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(question ? { id: question._id, ...values } : { ...values });
      onClose();
    });
  };

  return (
    <Modal
      title={question ? "Edit Question" : "Add New Question"}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {question ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter question title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea placeholder="Enter question description" rows={3} />
        </Form.Item>

        <Form.Item
          label="Categories"
          name="categories"
          rules={[
            { required: true, message: "Select or add at least one category" },
          ]}
        >
          <Select
            mode="tags"
            placeholder="Select or add categories"
            options={categories.map((category) => ({ value: category }))}
          />
        </Form.Item>

        <Form.Item
          label="Difficulty"
          name="complexity"
          rules={[{ required: true, message: "Select difficulty level" }]}
        >
          <Select placeholder="Select difficulty">
            <Option value="Easy">Easy</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Hard">Hard</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
