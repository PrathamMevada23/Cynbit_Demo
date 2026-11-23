import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

function connect(url: string) {
  const client = postgres(url, { max: 3, idle_timeout: 20, connect_timeout: 5, prepare: false });
  return { client, db: drizzle(client, { schema }) };
}

const shared = globalThis as typeof globalThis & { cynbitDb?: ReturnType<typeof connect> };

export function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  return shared.cynbitDb ??= connect(url);
}
