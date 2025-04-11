import ProtectedRoute from "~/components/common/ProtectedRoute";
import MatchContent from "../pages/MatchContent";

export function meta() {
  return [
    { title: "Match | PeerPrep" },
    { name: "description", content: "Match | PeerPrep" },
  ];
}

export default function Question() {
  return (
    <ProtectedRoute>
      <MatchContent />
    </ProtectedRoute>
  );
}
