import Elysia, { t } from "elysia";
import { db } from "../db";
import { isAuthenticated } from "../middlewares/auth";
import { and, eq } from "drizzle-orm";
import { tasks } from "../schema";

export const tasksController = new Elysia({
  name: "tasks",
  prefix: "/tasks",
})
  .use(isAuthenticated)
  .get("/", async ({ data, set }) => {
    if (!data) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userEmail, data.email));

    set.status = 200;
    return {
      success: true,
      message: "Tasks fetched successfully",
      data: {
        tasks: userTasks,
      },
    };
  })
  .get("/:id", async ({ data, set, params: { id } }) => {
    if (!data) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userEmail, data.email)))
      .limit(1);

    return {
      success: true,
      message: "Task fetched successfully",
      data: {
        task,
      },
    };
  })
  .post(
    "/",
    async ({ data, set, body }) => {
      if (!data) {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized",
          data: null,
        };
      }

      const [task] = await db
        .insert(tasks)
        .values({ ...body, userEmail: data.email })
        .returning({
          taskId: tasks.id,
          title: tasks.title,
          description: tasks.description,
        });

      if (!task) {
        set.status = 400;
        return {
          success: false,
          message: "Failed to create task",
          data: null,
        };
      }

      return {
        success: true,
        message: "Task created successfully",
        data: {
          task,
        },
      };
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
      }),
    },
  )
  .patch("/toggle/:id", async ({ data, set, params: { id } }) => {
    if (!data) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userEmail, data.email)))
      .limit(1);

    if (!task) {
      set.status = 404;
      return {
        success: false,
        message: "Task not found",
        data: null,
      };
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({ completed: !task.completed })
      .where(and(eq(tasks.id, id), eq(tasks.userEmail, data.email)))
      .returning();

    return {
      success: true,
      message: "Task updated successfully",
      data: {
        task: updatedTask,
      },
    };
  })
  .delete("/:id", async ({ data, set, params: { id } }) => {
    if (!data) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const [task] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userEmail, data.email)))
      .returning();

    if (!task) {
      set.status = 404;
      return {
        success: false,
        message: "Task not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Task deleted successfully",
      data: {
        task,
      },
    };
  });
