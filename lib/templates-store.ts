import { query, queryOne, toIso } from "./db"
import type { Template } from "./types"

/** DB row shape (snake_case) for the templates table. */
interface TemplateRow {
  id: string
  created_at: string | Date
  name: string
  text: string
}

/** Map a DB row to the app-facing Template shape. */
function mapTemplate(row: TemplateRow): Template {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    name: row.name ?? "",
    text: row.text ?? "",
  }
}

/** Read every template, newest first. */
export async function readTemplates(): Promise<Template[]> {
  const rows = await query<TemplateRow>(`SELECT * FROM templates ORDER BY created_at DESC`)
  return rows.map(mapTemplate)
}

/** Find a single template by id. */
export async function getTemplate(id: string): Promise<Template | null> {
  const row = await queryOne<TemplateRow>(`SELECT * FROM templates WHERE id = $1`, [id])
  return row ? mapTemplate(row) : null
}

/** Insert a new template and return the persisted record. */
export async function saveTemplate(template: Template): Promise<Template> {
  const row = await queryOne<TemplateRow>(
    `INSERT INTO templates (id, created_at, name, text)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [template.id, template.createdAt, template.name, template.text],
  )
  return row ? mapTemplate(row) : template
}

/** Delete a template by id. Returns true if a record was removed. */
export async function deleteTemplate(id: string): Promise<boolean> {
  const result = await query<TemplateRow>(`DELETE FROM templates WHERE id = $1 RETURNING id`, [id])
  return result.length > 0
}
