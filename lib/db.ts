import { Pool } from "pg"

/**
 * Shared Postgres connection pool (Neon).
 *
 * A single pool is reused across the whole app. In dev, Next.js hot-reloads
 * modules, which would otherwise leak a new pool on every reload — so we cache
 * it on globalThis.
 */
const globalForPool = globalThis as unknown as { __nexusPgPool?: Pool }

export const pool =
  globalForPool.__nexusPgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon requires TLS; the pooled connection string already sets sslmode.
    ssl: { rejectUnauthorized: false },
  })

if (process.env.NODE_ENV !== "production") {
  globalForPool.__nexusPgPool = pool
}

/** Run a parameterized query and return the rows, typed by the caller. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await pool.query(text, params)
  return result.rows as T[]
}

/** Run a query and return the first row, or null when there are none. */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}

/** Normalize a DB timestamp (Date | string) into the ISO string the app expects. */
export function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === "string") return new Date(value).toISOString()
  return new Date().toISOString()
}
