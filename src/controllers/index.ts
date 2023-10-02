import Elysia from "elysia";
import { authController } from "./auth";
import { tasksController } from "./tasks";

export const api = new Elysia({
  name: "api",
  prefix: "/api",
})
  .use(authController)
  .use(tasksController);
