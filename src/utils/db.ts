import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { DB_URL } from "@/utils/config";

const queryClient = postgres(DB_URL);
export const db = drizzle(queryClient);
