import {
  boolean,
  date,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: date("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: boolean("completed").default(false),
  createdAt: date("created_at").defaultNow(),
  userEmail: text("user_email").references(() => users.email),
});
