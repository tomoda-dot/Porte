-- ============================================================================
-- Porte Step 2-C: 全テーブル RLS（Row Level Security）有効化 ＆ authenticated のみ許可 SQL
-- ※ 先にアプリ側のコード反映（Anonymous Sign-In 自動認証）が完了してから実行してください！
-- 実行場所: Porte側 Supabase Dashboard -> SQL Editor -> New query
-- ============================================================================

DO $$
DECLARE
  tbl TEXT;
  pol RECORD;
  tables TEXT[] := ARRAY[
    '設定', 'スタッフ', 'スタッフ出欠', '利用者', '出欠', '日報', '臨時利用',
    '作業種別', '日報テンプレート', '個別支援計画', 'アセスメント', '会議録',
    '代理受領', 'ヒヤリハット', '苦情相談', '研修', '研修報告', 'シフト',
    '送迎ルート', '見学体験', '車両', '有給申請', '変更申請',
    'bento_master', 'bento_orders', 'bento_todays_menu',
    '研修受講記録', '委員会議事録', '作業スケジュール'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = tbl
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);

      -- 既存の緩い（anon/public向け）ポリシーがあれば削除
      FOR pol IN
        SELECT policyname FROM pg_policies
        WHERE schemaname = 'public' AND tablename = tbl
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
      END LOOP;

      -- 認証済み（authenticated）のみ読み書き許可
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
        'auth_only_' || md5(tbl),
        tbl
      );
    END IF;
  END LOOP;
END $$;
