import { pool, query, queryOne, toIso } from "./db"
import type { Analysis, AnalysisConfig, AnalysisResult, AnalysisSubject } from "./types"

/** DB row shape (snake_case) for the analyses table, with people aggregated from the join. */
interface AnalysisRow {
  id: string
  created_at: string | Date
  subject: string
  company_id: string | null
  company_name: string | null
  config: AnalysisConfig | null
  result: AnalysisResult | null
  person_ids: (string | null)[] | null
  person_names: (string | null)[] | null
}

/**
 * SELECT that rebuilds the person arrays from analysis_people, ordered by position
 * so the person analysis subject stays at index 0. FILTER drops NULLs from the
 * aggregate for analyses that have no attached people.
 */
const SELECT_WITH_PEOPLE = `
  SELECT
    a.*,
    COALESCE(
      ARRAY_AGG(ap.person_id ORDER BY ap.position)
        FILTER (WHERE ap.id IS NOT NULL),
      '{}'
    ) AS person_ids,
    COALESCE(
      ARRAY_AGG(ap.person_name ORDER BY ap.position)
        FILTER (WHERE ap.id IS NOT NULL),
      '{}'
    ) AS person_names
  FROM analyses a
  LEFT JOIN analysis_people ap ON ap.analysis_id = a.id
`

/** Map a DB row (with aggregated people) to the app-facing Analysis shape. */
function mapAnalysis(row: AnalysisRow): Analysis {
  const personIds = (row.person_ids ?? []).filter((v): v is string => v != null)
  const personNames = (row.person_names ?? []).filter((v): v is string => v != null)
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    subject: (row.subject as AnalysisSubject) ?? "company",
    companyId: row.company_id ?? undefined,
    companyName: row.company_name ?? undefined,
    personIds,
    personNames,
    config: (row.config ?? {}) as AnalysisConfig,
    result: (row.result ?? {}) as AnalysisResult,
  }
}

/** Read every analysis, newest first. */
export async function readAnalyses(): Promise<Analysis[]> {
  const rows = await query<AnalysisRow>(
    `${SELECT_WITH_PEOPLE} GROUP BY a.id ORDER BY a.created_at DESC`,
  )
  return rows.map(mapAnalysis)
}

/** Find a single analysis by id. */
export async function getAnalysis(id: string): Promise<Analysis | null> {
  const row = await queryOne<AnalysisRow>(
    `${SELECT_WITH_PEOPLE} WHERE a.id = $1 GROUP BY a.id`,
    [id],
  )
  return row ? mapAnalysis(row) : null
}

/** All analyses that include a given company. */
export async function analysesByCompany(companyId: string): Promise<Analysis[]> {
  const rows = await query<AnalysisRow>(
    `${SELECT_WITH_PEOPLE} WHERE a.company_id = $1 GROUP BY a.id ORDER BY a.created_at DESC`,
    [companyId],
  )
  return rows.map(mapAnalysis)
}

/** All analyses that include a given person. */
export async function analysesByPerson(personId: string): Promise<Analysis[]> {
  const rows = await query<AnalysisRow>(
    `${SELECT_WITH_PEOPLE}
     WHERE a.id IN (SELECT analysis_id FROM analysis_people WHERE person_id = $1)
     GROUP BY a.id ORDER BY a.created_at DESC`,
    [personId],
  )
  return rows.map(mapAnalysis)
}

/** Delete an analysis by id. Returns true if a row was removed. */
export async function deleteAnalysis(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    `DELETE FROM analyses WHERE id = $1 RETURNING id`,
    [id],
  )
  return rows.length > 0
}

/**
 * Insert a new analysis plus its person links, atomically.
 * personIds / personNames are stored as ordered rows in analysis_people.
 */
export async function saveAnalysis(analysis: Analysis): Promise<Analysis> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query(
      `INSERT INTO analyses
         (id, created_at, subject, company_id, company_name, config, result)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        analysis.id,
        analysis.createdAt,
        analysis.subject,
        analysis.companyId ?? null,
        analysis.companyName ?? null,
        JSON.stringify(analysis.config ?? {}),
        JSON.stringify(analysis.result ?? {}),
      ],
    )

    const ids = analysis.personIds ?? []
    const names = analysis.personNames ?? []
    for (let i = 0; i < ids.length; i++) {
      await client.query(
        `INSERT INTO analysis_people (analysis_id, person_id, person_name, position)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (analysis_id, person_id) DO NOTHING`,
        [analysis.id, ids[i], names[i] ?? null, i],
      )
    }

    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }

  return analysis
}
