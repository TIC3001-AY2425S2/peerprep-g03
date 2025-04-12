import ProtectedRoute from "~/components/common/ProtectedRoute";
import CollabContent from "../pages/CollabContent";

export function meta() {
  return [
    { title: "Collaboration | PeerPrep" },
    { name: "description", content: "Collaboration | PeerPrep" },
  ];
}

export default function Collab() {
  return (
    <ProtectedRoute>
      <CollabContent />
    </ProtectedRoute>
  );
}
