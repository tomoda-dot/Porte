// ===================================================================
// AI API Key 共通事前設定ファイル (ai-config.js)
// 事業所共通のAPIキーを事前設定済です。現場スタッフはキー入力不要で使えます。
// ===================================================================

var DEFAULT_AI_PROVIDER = 'gemini';

var PRECONFIGURED_API_KEYS = {
  gemini: localStorage.getItem('porte_ai_key_gemini') || '',
  openai: localStorage.getItem('porte_ai_key_openai') || '',
  groq: localStorage.getItem('porte_ai_key_groq') || '',
  openrouter: localStorage.getItem('porte_ai_key_openrouter') || '',
  claude: localStorage.getItem('porte_ai_key_claude') || ''
};
