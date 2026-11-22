-- ============================================================================
-- Porte Step 2-B: 「設定」テーブルからの専用テーブル分割 SQL
-- 実行場所: Supabase Dashboard -> SQL Editor -> New query に貼り付けて Run
-- ※ 既存の「設定」テーブルのデータは削除しないため安全に何度でも確認できます
-- ============================================================================

-- 1. 研修受講記録テーブル（1スタッフ×1研修＝1行で保存し同時編集の上書きを防止）
CREATE TABLE IF NOT EXISTS public."研修受講記録" (
  id TEXT PRIMARY KEY,
  "staffId" TEXT NOT NULL,
  "staffName" TEXT,
  "courseId" TEXT NOT NULL,
  "courseTitle" TEXT,
  "targetMonth" TEXT,
  status TEXT DEFAULT 'completed',
  score INTEGER,
  "completedAt" TIMESTAMPTZ DEFAULT NOW(),
  data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_training_rec_staff ON public."研修受講記録" ("staffId");
CREATE INDEX IF NOT EXISTS idx_training_rec_month ON public."研修受講記録" ("targetMonth");

-- 2. 委員会・議事録テーブル
CREATE TABLE IF NOT EXISTS public."委員会議事録" (
  id TEXT PRIMARY KEY,
  "meetingDate" TEXT,
  "committeeType" TEXT,
  title TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 作業スケジュール日別テーブル（1日＝1行で保存）
CREATE TABLE IF NOT EXISTS public."作業スケジュール" (
  date TEXT PRIMARY KEY,
  slots JSONB DEFAULT '{}'::jsonb,
  "updatedBy" TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 既存アプリとの互換用ポリシー（Step 2-C で Supabase Auth 移行時に厳格化）
ALTER TABLE public."研修受講記録" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."委員会議事録" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."作業スケジュール" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '研修受講記録' AND policyname = 'allow_all_training_rec') THEN
    CREATE POLICY allow_all_training_rec ON public."研修受講記録" FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '委員会議事録' AND policyname = 'allow_all_committee_min') THEN
    CREATE POLICY allow_all_committee_min ON public."委員会議事録" FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '作業スケジュール' AND policyname = 'allow_all_work_sched') THEN
    CREATE POLICY allow_all_work_sched ON public."作業スケジュール" FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
