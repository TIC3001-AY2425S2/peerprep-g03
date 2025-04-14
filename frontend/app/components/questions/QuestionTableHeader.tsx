import { Button, Input } from "antd";

interface Props {
  searchText: string;
  setSearchText: (text: string) => void;
  onSearch: () => void;
  onAddQuestion: () => void;
}

export default function QuestionTableHeader({
  searchText,
  setSearchText,
  onSearch,
  onAddQuestion,
}: Props) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2 w-1/3">
        <Input
          placeholder="Enter question title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full text-lg p-2"
          allowClear
        />
        <Button type="primary" onClick={onSearch}>
          Search
        </Button>
      </div>
      <Button type="primary" onClick={onAddQuestion}>
        Create New
      </Button>
    </div>
  );
}
