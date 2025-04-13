import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("profile", "routes/profile.tsx"),
  route("question", "routes/question.tsx"),
  route("match", "routes/match.tsx"),
  route("collab/:sessionId", "routes/collab.tsx"),
] satisfies RouteConfig;
