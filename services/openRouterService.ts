// ============================================================
// OpenRouter AI Service — De Deur Lelydorp
// Uses free OSS models via https://openrouter.ai
// ============================================================

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const RATE_LIMIT_STORAGE_KEY = 'ai_rate_limit_log';

// Available free OSS models
export const OPENROUTER_MODELS = [
  { id: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B (Gratis)' },
  { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (Gratis)' },
  { id: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B (Gratis)' },
  { id: 'microsoft/phi-3-mini-128k-instruct:free', label: 'Phi-3 Mini (Gratis)' },
  { id: 'qwen/qwen-2-7b-instruct:free', label: 'Qwen 2 7B (Gratis)' },
];

// Rate limiter: tracks timestamps of messages within the rolling window
const RATE_WINDOW_MS = 60_000; // 1 minute

const getRateLog = (): number[] => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const setRateLog = (log: number[]) => {
  localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(log));
};

/**
 * Check if rate limit is exceeded.
 * Returns { allowed: boolean, remaining: number, resetInMs: number }
 */
export const checkRateLimit = (maxPerMinute = 10): { allowed: boolean; remaining: number; resetInMs: number } => {
  const now = Date.now();
  const log = getRateLog().filter(t => now - t < RATE_WINDOW_MS);
  setRateLog(log);

  const remaining = Math.max(0, maxPerMinute - log.length);
  const oldest = log.length > 0 ? log[0] : now;
  const resetInMs = Math.max(0, RATE_WINDOW_MS - (now - oldest));

  return {
    allowed: log.length < maxPerMinute,
    remaining,
    resetInMs,
  };
};

const recordMessage = () => {
  const log = getRateLog();
  log.push(Date.now());
  setRateLog(log);
};

// AI settings stored in localStorage
const AI_SETTINGS_KEY = 'ai_settings';

export interface AiSettings {
  model: string;
  systemInstruction: string;
  welcomeMessage: string;
  assistantName: string;
  rateLimit: number;
  apiKey: string;
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  model: import.meta.env.VITE_OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
  systemInstruction: `Je bent de behulpzame AI-assistent van 'Evangelie Gemeente De Deur Lelydorp'. Je toon is vriendelijk, gastvrij en duidelijk. Context: - Locatie: Lelydorp, Suriname. - Identiteit: Onderdeel van de wereldwijde Christian Fellowship Ministries (CFM). - Doel: Evangelisatie, discipelschap en kerkplanting. - Sfeer: Een plek waar levens veranderen, genezing en hoop te vinden zijn. - Diensten: Zondag 11:00 & 18:00, Woensdag 19:00. Geef antwoorden in het Nederlands. Wees kort en bondig.`,
  welcomeMessage: 'Welkom! Ik ben de virtuele assistent van De Deur Lelydorp. Hoe kan ik u helpen?',
  assistantName: 'Assistent',
  rateLimit: parseInt(import.meta.env.VITE_AI_RATE_LIMIT || '10'),
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
};

export const getAiSettings = (): AiSettings => {
  try {
    const stored = localStorage.getItem(AI_SETTINGS_KEY);
    if (!stored) return DEFAULT_AI_SETTINGS;
    return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(stored) };
  } catch { return DEFAULT_AI_SETTINGS; }
};

export const saveAiSettings = (settings: AiSettings) => {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
};

// Chat history for context (last 10 messages)
const CHAT_HISTORY_KEY = 'ai_chat_history';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const getChatHistory = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const addToChatHistory = (role: 'user' | 'assistant', content: string) => {
  const history = getChatHistory();
  history.push({ role, content });
  // Keep last 10 messages for context
  const trimmed = history.slice(-10);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
};

export const clearChatHistory = () => {
  localStorage.removeItem(CHAT_HISTORY_KEY);
};

/**
 * Send a message to OpenRouter and return the AI response.
 */
export const sendMessageToOpenRouter = async (userMessage: string): Promise<string> => {
  const settings = getAiSettings();
  const rateCheck = checkRateLimit(settings.rateLimit);

  if (!rateCheck.allowed) {
    const secs = Math.ceil(rateCheck.resetInMs / 1000);
    return `U heeft het berichtenlimiet bereikt. Probeer het over ${secs} seconden opnieuw.`;
  }

  recordMessage();
  addToChatHistory('user', userMessage);

  const history = getChatHistory();
  const messages = [
    { role: 'system', content: settings.systemInstruction },
    ...history.map(m => ({ role: m.role, content: m.content })),
  ];

  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey || 'free-tier'}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'De Deur Lelydorp',
      },
      body: JSON.stringify({
        model: settings.model,
        messages,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('OpenRouter error:', err);
      return 'Ik kan momenteel geen verbinding maken met de AI service. Probeer het later opnieuw.';
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'Geen antwoord ontvangen.';
    addToChatHistory('assistant', reply);
    return reply;

  } catch (error) {
    console.error('OpenRouter fetch error:', error);
    return 'Verbindingsfout. Controleer uw internetverbinding en probeer opnieuw.';
  }
};
