import { bdApi } from './shared';

const CACHE_KEY = `transcriptionCache`;

export const loadTranscription = (itemId: string) => {
  const transcriptionCache = bdApi.Data.load(CACHE_KEY);
  if (transcriptionCache) {
    return transcriptionCache[itemId] as string;
  }
};

export const saveTranscription = (itemId: string, transcription: string) => {
  const transcriptionCache = bdApi.Data.load(CACHE_KEY) ?? {};
  transcriptionCache[itemId] = transcription;
  bdApi.Data.save(CACHE_KEY, transcriptionCache);
};
