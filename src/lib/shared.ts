import { QueryClient } from '@tanstack/react-query';
import OpenAI from 'openai';

export const openaiClient = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const bdApi = new BdApi('TranscribeVoiceNotes');

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: Infinity,
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});
