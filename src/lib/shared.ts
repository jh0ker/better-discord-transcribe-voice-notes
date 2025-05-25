import { QueryClient } from '@tanstack/react-query';
import OpenAI from 'openai';

export const openaiClient = new OpenAI({
  apiKey: '', // Loaded from settings when doing requests
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
