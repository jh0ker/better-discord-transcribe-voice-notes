import OpenAI from 'openai';

export const openaiClient = new OpenAI({
  apiKey: '', // Loaded from settings when doing requests
  dangerouslyAllowBrowser: true,
});

export const bdApi = new BdApi('TranscribeVoiceNotes');
