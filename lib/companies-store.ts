import { query, queryOne, toIso } from "./db"
import type { Company } from "./types"

/** DB row shape (snake_case) for the companies table. */
interface CompanyRow {
  id: string
  created_at: string | Date
  name: string
  website: string | null
  industry: string | null
  target_market: string | null
  product_description: string | null
  business_goals: string | null
  additional_info: string | null
  links: string | null
}

/** Map a DB row to the app-facing Company shape (empty strings, never null). */
function mapCompany(row: CompanyRow): Company {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    name: row.name ?? "",
    website: row.website ?? "",
    industry: row.industry ?? "",
    targetMarket: row.target_market ?? "",
    productDescription: row.product_description ?? "",
    businessGoals: row.business_goals ?? "",
    additionalInfo: row.additional_info ?? "",
    links: row.links ?? "",
  }
}

/** Read every company, newest first. */
export async function readCompanies(): Promise<Company[]> {
  const rows = await query<CompanyRow>(`SELECT * FROM companies ORDER BY created_at DESC`)
  return rows.map(mapCompany)
}

/** Find a single company by id. */
export async function getCompany(id: string): Promise<Company | null> {
  const row = await queryOne<CompanyRow>(`SELECT * FROM companies WHERE id = $1`, [id])
  return row ? mapCompany(row) : null
}

/** Insert a new company and return the persisted record. */
export async function saveCompany(company: Company): Promise<Company> {
  const row = await queryOne<CompanyRow>(
    `INSERT INTO companies
       (id, created_at, name, website, industry, target_market,
        product_description, business_goals, additional_info, links)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      company.id,
      company.createdAt,
      company.name,
      company.website,
      company.industry,
      company.targetMarket,
      company.productDescription,
      company.businessGoals,
      company.additionalInfo,
      company.links,
    ],
  )
  return row ? mapCompany(row) : company
}

/** Delete a company by id. Returns true if a row was removed. */
export async function deleteCompany(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    `DELETE FROM companies WHERE id = $1 RETURNING id`,
    [id],
  )
  return rows.length > 0
}

/** Update an existing company in place. Returns the updated record, or null if not found. */
export async function updateCompany(
  id: string,
  patch: Partial<Omit<Company, "id" | "createdAt">>,
): Promise<Company | null> {
  const existing = await getCompany(id)
  if (!existing) return null
  const next = { ...existing, ...patch }
  const row = await queryOne<CompanyRow>(
    `UPDATE companies SET
       name = $2,
       website = $3,
       industry = $4,
       target_market = $5,
       product_description = $6,
       business_goals = $7,
       additional_info = $8,
       links = $9,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      next.name,
      next.website,
      next.industry,
      next.targetMarket,
      next.productDescription,
      next.businessGoals,
      next.additionalInfo,
      next.links,
    ],
  )
  return row ? mapCompany(row) : null
}
