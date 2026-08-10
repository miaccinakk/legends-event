/**
 * =============================================================================
 *  SIMPLE FILE / ENV-BASED AUTH  (no database)
 * =============================================================================
 *
 *  Credentials live in environment variables (see .env.local):
 *    - AUTH_EMAIL     the allowed login email
 *    - AUTH_PASSWORD  the password (kept intentionally simple, no rules)
 *    - AUTH_SECRET    server secret used to sign the session cookie
 *
 *  There is no user database. A single account guards the whole app. On a
 *  successful login we set an httpOnly cookie whose value is an HMAC-like
 *  hash of the credentials + secret. Middleware recomputes the expected value
 *  and compares — so the cookie cannot be forged without knowing the secret.
 *
 *  The fallback defaults below let it work out-of-the-box in preview; override
 *  them in the project environment for anything real.
 * =============================================================================
 */

export const AUTH_EMAIL = process.env.AUTH_EMAIL || "admin@mail.ru"
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD || "12345"
export const AUTH_SECRET = process.env.AUTH_SECRET || "nexus-dev-secret-change-me"

export const SESSION_COOKIE = "nexus_session"

/** Uses the Web Crypto API, available in both the Edge (middleware) and Node runtimes. */
export async function makeSessionToken(email: string, password: string, secret: string): Promise<string> {
  const data = `${email}:${password}:${secret}`
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data))
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/** The valid cookie value for the configured credentials. */
export function expectedSessionToken(): Promise<string> {
  return makeSessionToken(AUTH_EMAIL, AUTH_PASSWORD, AUTH_SECRET)
}

export function verifyCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === AUTH_EMAIL.trim().toLowerCase() && password === AUTH_PASSWORD
}
