/**
 * Porte Supabase DB 接続設定ファイル
 * GitHub Pagesやローカル環境でSupabaseに直接接続するための設定です。
 * 画面上の「⚙️ DB接続設定」ボタンから入力・保存することも可能です。
 */
window.SUPABASE_URL = window.SUPABASE_URL || localStorage.getItem('porte_supabase_url') || "https://ukdbwxhvnmiibuwbrdel.supabase.co";
window.SUPABASE_KEY = window.SUPABASE_KEY || localStorage.getItem('porte_supabase_key') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZGJ3eGh2bm1paWJ1d2JyZGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDUyNDgsImV4cCI6MjA5NjE4MTI0OH0.PEJdV8HDreqE28-i27j-TODNFJP0RGKFrrNRBT-rZag";
