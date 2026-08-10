import { query, queryOne, toIso } from "./db"
import type { ContentTypeKey, Email } from "./types"

/** DB row shape (snake_case) for the emails table. */
interface EmailRow {
  id: string
  created_at: string | Date
  company_id: string | null
  company_name: string | null
  person_id: string | null
  person_name: string | null
  analysis_id: string | null
  content_type: string
  content_label: string | null
  instructions: string | null
  language: string | null
  guidance: string | null
  text: string
}

/** Map a DB row to the app-facing Email shape. */
function mapEmail(row: EmailRow): Email {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    companyId: row.company_id ?? "",
    companyName: row.company_name ?? "",
    personId: row.person_id ?? undefined,
    personName: row.person_name ?? undefined,
    analysisId: row.analysis_id ?? undefined,
    contentType: row.content_type as ContentTypeKey,
    contentLabel: row.content_label ?? "",
    instructions: row.instructions ?? "",
    language: row.language ?? "Auto",
    guidance: row.guidance ?? "",
    text: row.text ?? "",
  }
}

/** Read every email, newest first. */
export async function readEmails(): Promise<Email[]> {
  const rows = await query<EmailRow>(`SELECT * FROM emails ORDER BY created_at DESC`)
  return rows.map(mapEmail)
}

/** Find a single email by id. */
export async function getEmail(id: string): Promise<Email | null> {
  const row = await queryOne<EmailRow>(`SELECT * FROM emails WHERE id = $1`, [id])
  return row ? mapEmail(row) : null
}

/** All emails that belong to a given company. */
export async function emailsByCompany(companyId: string): Promise<Email[]> {
  const rows = await query<EmailRow>(
    `SELECT * FROM emails WHERE company_id = $1 ORDER BY created_at DESC`,
    [companyId],
  )
  return rows.map(mapEmail)
}

/** All emails that target a given person. */
export async function emailsByPerson(personId: string): Promise<Email[]> {
  const rows = await query<EmailRow>(
    `SELECT * FROM emails WHERE person_id = $1 ORDER BY created_at DESC`,
    [personId],
  )
  return rows.map(mapEmail)
}

/** Update the body text of an existing email and return the updated record. */
export async function updateEmailText(id: string, text: string): Promise<Email | null> {
  const row = await queryOne<EmailRow>(
    `UPDATE emails SET text = $2 WHERE id = $1 RETURNING *`,
    [id, text],
  )
  return row ? mapEmail(row) : null
}

/** Delete an email by id. Returns true if a row was removed. */
export async function deleteEmail(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    `DELETE FROM emails WHERE id = $1 RETURNING id`,
    [id],
  )
  return rows.length > 0
}

/** Insert a new email and return the persisted record. */
export async function saveEmail(email: Email): Promise<Email> {
  const row = await queryOne<EmailRow>(
    `INSERT INTO emails
       (id, created_at, company_id, company_name, person_id, person_name,
        analysis_id, content_type, content_label, instructions, language, guidance, text)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [
      email.id,
      email.createdAt,
      email.companyId || null,
      email.companyName || null,
      email.personId ?? null,
      email.personName ?? null,
      email.analysisId ?? null,
      email.contentType,
      email.contentLabel,
      email.instructions,
      email.language,
      email.guidance,
      email.text,
    ],
  )
  return row ? mapEmail(row) : email
}
