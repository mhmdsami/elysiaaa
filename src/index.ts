import Elysia from "elysia";
import { api } from "./controllers";
import { jwt } from "@elysiajs/jwt";

const app = new Elysia({
  name: "app",
})
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
    }),
  )
  .use(api)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
