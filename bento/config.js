/**
 * Porte Supabase DB 接続設定ファイル
 * GitHub Pagesやローカル環境でSupabaseに直接接続するための設定です。
 * 画面上の「⚙️ DB接続設定」ボタンから入力・保存することも可能です。
 */
window.SUPABASE_URL = window.SUPABASE_URL || localStorage.getItem('porte_supabase_url') || "https://ukdbwxhvnmiibuwbrdel.supabase.co";
window.SUPABASE_KEY = window.SUPABASE_KEY || localStorage.getItem('porte_supabase_key') || "sb_publishable_-WcEz5_nVkMXakchuiniRQ_iYRaZEjx";
