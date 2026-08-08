/*
# Create issues and issue_images tables

1. New Tables
- `issues`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `title` (text, not null)
  - `description` (text, not null)
  - `category` (text, not null) — pothole, garbage, streetlight, water_leak, road_damage, manhole, other
  - `location` (text, not null) — free-text address/area
  - `lat` (numeric, nullable) — optional latitude
  - `lng` (numeric, nullable) — optional longitude
  - `status` (text, not null, default 'reported') — reported, under_review, in_progress, resolved
  - `image_url` (text, nullable) — URL of uploaded image in Supabase Storage
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
- `issue_images`
  - `id` (uuid, primary key)
  - `issue_id` (uuid, references issues on delete cascade)
  - `user_id` (uuid, not null, defaults to auth.uid())
  - `url` (text, not null)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- Owner-scoped CRUD on `issues`: each authenticated user can only access their own rows.
- Owner-scoped CRUD on `issue_images`: each authenticated user can only access images for their own issues.
- Storage bucket `issue-photos` created with public read, authenticated upload.
*/

CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  lat double precision,
  lng double precision,
  status text NOT NULL DEFAULT 'reported',
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_issues" ON issues;
CREATE POLICY "select_own_issues" ON issues FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_issues" ON issues;
CREATE POLICY "insert_own_issues" ON issues FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_issues" ON issues;
CREATE POLICY "update_own_issues" ON issues FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_issues" ON issues;
CREATE POLICY "delete_own_issues" ON issues FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS issue_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE issue_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_issue_images" ON issue_images;
CREATE POLICY "select_own_issue_images" ON issue_images FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_issue_images" ON issue_images;
CREATE POLICY "insert_own_issue_images" ON issue_images FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_issue_images" ON issue_images;
CREATE POLICY "delete_own_issue_images" ON issue_images FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS issues_user_id_idx ON issues(user_id);
CREATE INDEX IF NOT EXISTS issues_status_idx ON issues(status);
CREATE INDEX IF NOT EXISTS issues_created_at_idx ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS issue_images_issue_id_idx ON issue_images(issue_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS issues_updated_at ON issues;
CREATE TRIGGER issues_updated_at BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-photos', 'issue-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can read issue photos" ON storage.objects;
CREATE POLICY "Anyone can read issue photos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'issue-photos');

DROP POLICY IF EXISTS "Authenticated users can upload issue photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload issue photos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'issue-photos');

DROP POLICY IF EXISTS "Users can delete own issue photos" ON storage.objects;
CREATE POLICY "Users can delete own issue photos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'issue-photos' AND owner = auth.uid());
