import { query, queryOne, toIso } from "./db"
import type { Person } from "./types"

/** DB row shape (snake_case) for the people table. */
interface PersonRow {
  id: string
  created_at: string | Date
  name: string
  role: string | null
  website: string | null
  links: string | null
  bio: string | null
  experience: string | null
  education: string | null
  additional_info: string | null
}

/** Map a DB row to the app-facing Person shape (empty strings, never null). */
function mapPerson(row: PersonRow): Person {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    name: row.name ?? "",
    role: row.role ?? "",
    website: row.website ?? "",
    links: row.links ?? "",
    bio: row.bio ?? "",
    experience: row.experience ?? "",
    education: row.education ?? "",
    additionalInfo: row.additional_info ?? "",
  }
}

/** Read every person, newest first. */
export async function readPeople(): Promise<Person[]> {
  const rows = await query<PersonRow>(`SELECT * FROM people ORDER BY created_at DESC`)
  return rows.map(mapPerson)
}

/** Find a single person by id. */
export async function getPerson(id: string): Promise<Person | null> {
  const row = await queryOne<PersonRow>(`SELECT * FROM people WHERE id = $1`, [id])
  return row ? mapPerson(row) : null
}

/** Return every person whose id is in the given list, preserving newest-first order. */
export async function getPeopleByIds(ids: string[]): Promise<Person[]> {
  if (ids.length === 0) return []
  const rows = await query<PersonRow>(
    `SELECT * FROM people WHERE id = ANY($1::uuid[]) ORDER BY created_at DESC`,
    [ids],
  )
  return rows.map(mapPerson)
}

/** Insert a new person and return the persisted record. */
export async function savePerson(person: Person): Promise<Person> {
  const row = await queryOne<PersonRow>(
    `INSERT INTO people
       (id, created_at, name, role, website, links, bio, experience, education, additional_info)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      person.id,
      person.createdAt,
      person.name,
      person.role,
      person.website,
      person.links,
      person.bio,
      person.experience,
      person.education,
      person.additionalInfo,
    ],
  )
  return row ? mapPerson(row) : person
}

/** Delete a person by id. Returns true if a row was removed. */
export async function deletePerson(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    `DELETE FROM people WHERE id = $1 RETURNING id`,
    [id],
  )
  return rows.length > 0
}

/** Update an existing person in place. Returns the updated record, or null if not found. */
export async function updatePerson(
  id: string,
  patch: Partial<Omit<Person, "id" | "createdAt">>,
): Promise<Person | null> {
  const existing = await getPerson(id)
  if (!existing) return null
  const next = { ...existing, ...patch }
  const row = await queryOne<PersonRow>(
    `UPDATE people SET
       name = $2,
       role = $3,
       website = $4,
       links = $5,
       bio = $6,
       experience = $7,
       education = $8,
       additional_info = $9,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      next.name,
      next.role,
      next.website,
      next.links,
      next.bio,
      next.experience,
      next.education,
      next.additionalInfo,
    ],
  )
  return row ? mapPerson(row) : null
}
