import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("question", "routes/question.tsx"),
  route("collab/:id", "routes/collab.tsx"),
] satisfies RouteConfig;
