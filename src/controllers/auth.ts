import Elysia, { t } from "elysia";
import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export const authController = new Elysia({
  name: "auth",
  prefix: "/auth",
})
  .post(
    "/sign-up",
    async ({ body, set }) => {
      const [email] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.email, body.email))
        .limit(1);

      if (email) {
        set.status = 409;
        return {
          success: false,
          message: "Email already exists",
          data: null,
        };
      }

      const [username] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.name, body.name))
        .limit(1);

      if (username) {
        set.status = 409;
        return {
          success: false,
          message: "Username already exists",
          data: null,
        };
      }

      const [user] = await db
        .insert(users)
        .values({ ...body, password: await Bun.password.hash(body.password) })
        .returning({
          id: users.id,
          email: users.email,
          username: users.name,
        });

      return {
        success: true,
        message: "User created successfully",
        data: {
          user,
        },
      };
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    },
  )
  .post(
    "/sign-in",
    // @ts-ignore
    async ({ body, set, jwt }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, body.email))
        .limit(1);

      if (!user) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
          data: null,
        };
      }

      if (!(await Bun.password.verify(body.password, user.password))) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid password",
          data: null,
        };
      }

      const accessToken = await jwt.sign({
        name: user.name,
        email: user.email,
      });

      set.status = 200;
      return {
        success: true,
        message: "User signed in successfully",
        data: {
          name: user.name,
          email: user.email,
          accessToken,
        },
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    },
  );
