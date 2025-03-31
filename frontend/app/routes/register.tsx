import RegisterContent from "../pages/RegisterContent";

export function meta() {
  return [
    { title: "Register | PeerPrep" },
    { name: "description", content: "Register | PeerPrep" },
  ];
}

export default function Login() {
  return <RegisterContent />;
}
