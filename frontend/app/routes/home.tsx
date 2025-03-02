import HomeContent from "../pages/HomeContent";

export function meta() {
  return [
    { title: "PeerPrep" },
    { name: "description", content: "Welcome to PeerPrep!" },
  ];
}

export default function Home() {
  return <HomeContent />;
}
