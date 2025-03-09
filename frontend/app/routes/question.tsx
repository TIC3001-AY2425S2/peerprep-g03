import QuestionContent from "../pages/QuestionContent";
export function meta() {
  return [
    { title: "Questions | PeerPrep" },
    { name: "description", content: "Questions | PeerPrep" },
  ];
}

export default function Question() {
  return <QuestionContent />;
}
