import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { api } from "@/controllers";
import {JWT_SECRET, PORT} from "@/utils/config";

const app = new Elysia({
  name: "app",
})
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    }),
  )
  .use(api)
  .listen(PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
