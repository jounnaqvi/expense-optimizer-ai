/*
  # Create audits and leads tables

  1. New Tables
    - `audits`
      - `id` (uuid, primary key) - Unique audit identifier
      - `email` (text) - User email
      - `company_name` (text) - Company name
      - `team_size` (integer) - Team size
      - `primary_use_case` (text) - Primary use case (coding, writing, research, mixed, data_analysis)
      - `tools` (jsonb) - Array of tool entries with name, plan, monthly_spend, seats
      - `total_monthly_spend` (numeric) - Total current monthly spend
      - `recommended_monthly_spend` (numeric) - Total recommended monthly spend
      - `monthly_savings` (numeric) - Monthly savings amount
      - `annual_savings` (numeric) - Annual savings amount
      - `recommendations` (jsonb) - Array of recommendation objects
      - `ai_summary` (text) - AI-generated summary
      - `created_at` (timestamptz) - Creation timestamp
    - `leads`
      - `id` (uuid, primary key) - Unique lead identifier
      - `audit_id` (uuid, foreign key) - Reference to audit
      - `email` (text) - Lead email
      - `company_name` (text) - Company name
      - `role` (text) - User role
      - `monthly_savings` (numeric) - Savings amount that triggered lead capture
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Public INSERT policy for audits (anyone can create an audit)
    - Public SELECT policy for audits (shareable reports need read access)
    - Public INSERT policy for leads (anyone can submit lead info)
    - No UPDATE or DELETE policies (data is immutable once created)
*/

CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text DEFAULT '',
  company_name text DEFAULT '',
  team_size integer DEFAULT 1,
  primary_use_case text DEFAULT 'mixed',
  tools jsonb DEFAULT '[]'::jsonb,
  total_monthly_spend numeric DEFAULT 0,
  recommended_monthly_spend numeric DEFAULT 0,
  monthly_savings numeric DEFAULT 0,
  annual_savings numeric DEFAULT 0,
  recommendations jsonb DEFAULT '[]'::jsonb,
  ai_summary text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create audits"
  ON audits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view audits"
  ON audits FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid REFERENCES audits(id) ON DELETE CASCADE,
  email text NOT NULL,
  company_name text DEFAULT '',
  role text DEFAULT '',
  monthly_savings numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view leads"
  ON leads FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at);
