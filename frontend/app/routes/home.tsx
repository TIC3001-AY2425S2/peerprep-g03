import HomeContent from "../pages/HomeContent";

export function meta() {
  return [
    { title: "PeepPrep" },
    { name: "description", content: "Welcome to PeepPrep!" },
  ];
}

export default function Home() {
  return <HomeContent />;
}
