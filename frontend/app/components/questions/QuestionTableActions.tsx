import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

import type { Question } from "../../types/Question";

interface Props {
  id: string;
  onDelete: (id: string) => void;
  onEdit: (question: Question) => void;
  question: Question;
}

export default function QuestionTableActions({
  id,
  onDelete,
  onEdit,
  question,
}: Props) {
  return (
    <Space>
      <Button icon={<EditOutlined />} onClick={() => onEdit(question)} />
      <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(id)} />
    </Space>
  );
}
