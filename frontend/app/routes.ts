import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("question", "routes/question.tsx"),
] satisfies RouteConfig;
