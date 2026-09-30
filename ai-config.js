// ===================================================================
// AI API Key 共通事前設定ファイル (ai-config.js)
// 事業所共通のAPIキーを設定しておくと、現場スタッフがキーを入力せずにそのまま使えます。
// (キーが空の場合は、手動入力または「⚡ オフライン定型文モード」で動作します)
// ===================================================================

var DEFAULT_AI_PROVIDER = 'gemini'; // デフォルトのAI ('gemini', 'openai', 'groq', 'openrouter', 'claude', 'offline')

var PRECONFIGURED_API_KEYS = {
  gemini: '',     // Google Gemini API Key (例: 'AIzaSy...')
  openai: '',     // OpenAI API Key (例: 'sk-...')
  groq: '',       // Groq API Key (例: 'gsk_...')
  openrouter: '', // OpenRouter API Key (例: 'sk-or-...')
  claude: ''      // Anthropic Claude API Key (例: 'sk-ant-...')
};
