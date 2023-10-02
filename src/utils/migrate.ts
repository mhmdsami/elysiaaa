import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const connectionString = Bun.env.DB_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations ran successfully");
  process.exit(0);
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
