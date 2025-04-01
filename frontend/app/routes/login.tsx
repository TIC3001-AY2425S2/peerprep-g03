import LoginContent from "../pages/LoginContent";

export function meta() {
  return [
    { title: "Login | PeerPrep" },
    { name: "description", content: "Login | PeerPrep" },
  ];
}

export default function Login() {
  return <LoginContent />;
}
