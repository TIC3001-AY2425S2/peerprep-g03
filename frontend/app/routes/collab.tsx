import ProtectedRoute from "~/components/common/ProtectedRoute";
import CollabContent from "../pages/CollabContent";


export default function Collab() {
  return (
    <ProtectedRoute>
     <CollabContent />
    </ProtectedRoute>
  );
}