ALTER TABLE issues ADD COLUMN IF NOT EXISTS resolution_note text;

CREATE OR REPLACE FUNCTION public.is_authority()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'authority'
  );
$$;

DROP POLICY IF EXISTS "select_own_issues" ON issues;
CREATE POLICY "citizens_select_own_issues" ON issues FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.is_authority());

DROP POLICY IF EXISTS "insert_own_issues" ON issues;
CREATE POLICY "citizens_insert_own_issues" ON issues FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id AND NOT public.is_authority());

DROP POLICY IF EXISTS "update_own_issues" ON issues;
CREATE POLICY "authorities_update_issues" ON issues FOR UPDATE
  TO authenticated USING (public.is_authority()) WITH CHECK (public.is_authority());