import ProtectedRoute from "../components/common/ProtectedRoute";
import ProfileContent from "../pages/ProfileContent";

export function meta() {
  return [
    { title: "Profile | PeerPrep" },
    { name: "description", content: "Profile | PeerPrep" },
  ];
}

export default function Question() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
