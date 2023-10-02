import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const queryClient = postgres(Bun.env.DB_URL!);
export const db = drizzle(queryClient);
