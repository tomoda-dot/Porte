-- ============================================================================
-- Porte Step 2-C: public スキーマ内の「全テーブル」に一括で RLS を設定する SQL
-- ※ 漏れなく全テーブルの UNRESTRICTED を解消します
-- ============================================================================

DO $$
DECLARE
  r RECORD;
  pol RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);

    FOR pol IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = r.tablename
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, r.tablename);
    END LOOP;

    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      'auth_only_' || md5(r.tablename),
      r.tablename
    );
  END LOOP;
END $$;
