import Elysia from "elysia";
import { authController } from "./auth";

export const api = new Elysia({
  name: "api",
  prefix: "/api",
})
  .use(authController)
