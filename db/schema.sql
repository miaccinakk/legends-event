-- =========================================================================
--  NexusHub AI — Postgres schema
--
--  Replaces the current data/*.json stores (companies, people, analyses,
--  emails, templates) with a relational model, plus an admin-managed user /
--  auth layer modeled on our previous project's conventions.
--
--  Conventions (kept identical to the earlier schema so a future backend can
--  reuse the same helpers):
--    * UUID primary keys via gen_random_uuid() (pgcrypto).
--    * TEXT + CHECK instead of native ENUM types, so values are easy to grow.
--    * TIMESTAMPTZ everywhere (the app stores ISO-8601 timestamps).
--    * Every table creation and index is idempotent (IF NOT EXISTS), so this
--      file is safe to run repeatedly on db:init.
--    * "Snapshot" columns (e.g. company_name on analyses/emails) mirror how the
--      app renders lists today without a join — kept denormalized on purpose.
--
--  Ownership: top-level entities carry a nullable user_id for the future
--  multi-user backend. Today a single admin account owns everything; the FKs
--  are ready for per-user scoping without a migration.
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
--  Users & authentication  (accounts are created by an admin, not self-signup)
-- =========================================================================

-- Application users. Created through the admin panel; is_admin flags the
-- operator account(s). password_hash stores a hashed secret (never plaintext).
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email verification tokens (issued when an admin creates / invites a user).
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refresh tokens for long-lived sessions.
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password reset tokens.
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password reset rate limiting (one row per attempt).
CREATE TABLE IF NOT EXISTS password_reset_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
--  Companies  (data/companies.json -> table)
-- =========================================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- owner (future multi-user)
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  target_market TEXT,
  product_description TEXT,
  business_goals TEXT,
  additional_info TEXT,
  links TEXT,                          -- extra links, one per line
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
--  People  (data/people.json -> table). Independent of any company.
-- =========================================================================
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT,                           -- title, e.g. "CEO", "Head of Growth"
  website TEXT,
  links TEXT,                          -- social links, one per line
  bio TEXT,                            -- who they are, background, what matters
  experience TEXT,                     -- roles, companies, achievements
  education TEXT,                      -- schools, degrees, courses
  additional_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
--  Analyses  (data/analyses.json -> table). A "lead" built from ONE company
--  (for a company analysis) or ONE+ people (for a person analysis).
--
--  config : run steering (subject, exclusions, priorities, guidance,
--           language) — stored as JSONB because the shape is flexible and is
--           only ever read/written as a whole (see AnalysisConfig).
--  result : section key -> markdown map (AnalysisResult) — also JSONB.
-- =========================================================================
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL DEFAULT 'company' CHECK (subject IN ('company', 'person')),
  -- Company subject (company analysis) or optional context (person analysis).
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  company_name TEXT,                   -- snapshot for list rendering (no join)
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- People attached to an analysis (was Analysis.personIds / personNames arrays).
-- position preserves order — for a person analysis position 0 is the subject.
-- person_name is a snapshot so lists render without joining people.
CREATE TABLE IF NOT EXISTS analysis_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  person_name TEXT,                    -- snapshot at time of analysis
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (analysis_id, person_id)
);

-- =========================================================================
--  Emails  (data/emails.json -> table). Outreach content built on a company,
--  optionally targeting a specific person and/or grounded in an analysis.
-- =========================================================================
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  company_name TEXT,                   -- snapshot
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  person_name TEXT,                    -- snapshot
  analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('linkedin', 'email', 'event', 'twitter', 'video', 'ideas')),
  content_label TEXT,                  -- human-facing label snapshot
  instructions TEXT,
  language TEXT DEFAULT 'Auto',
  guidance TEXT,
  text TEXT NOT NULL,                  -- the generated body
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
--  Templates  (data/templates.json -> table). Reusable text the AI adapts.
-- =========================================================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,                  -- short name shown in lists / picker
  text TEXT NOT NULL DEFAULT '',       -- template body
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
--  Indexes
-- =========================================================================

-- Users / auth
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_attempts_user_id ON password_reset_attempts(user_id);

-- Companies
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);
CREATE INDEX IF NOT EXISTS idx_companies_name_lower ON companies(LOWER(name));

-- People
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);
CREATE INDEX IF NOT EXISTS idx_people_created_at ON people(created_at);
CREATE INDEX IF NOT EXISTS idx_people_name_lower ON people(LOWER(name));

-- Analyses
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_subject ON analyses(subject);
CREATE INDEX IF NOT EXISTS idx_analyses_company_id ON analyses(company_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);

-- Analysis <-> people
CREATE INDEX IF NOT EXISTS idx_analysis_people_analysis_id ON analysis_people(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analysis_people_person_id ON analysis_people(person_id);

-- Emails
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_company_id ON emails(company_id);
CREATE INDEX IF NOT EXISTS idx_emails_person_id ON emails(person_id);
CREATE INDEX IF NOT EXISTS idx_emails_analysis_id ON emails(analysis_id);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at);

-- Templates
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at);

-- =========================================================================
--  Migrations for existing databases (idempotent)
--  Add safe ALTERs here as the model grows; they run on every db:init.
-- =========================================================================

-- Older analyses rows without a subject default to 'company'.
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS subject TEXT NOT NULL DEFAULT 'company';
