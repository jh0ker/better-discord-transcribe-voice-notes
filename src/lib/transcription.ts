import { useCallback, useState } from 'react';

import { loadSettings, transcriptionCache, type Settings } from './data';
import type { Item } from '../components/transcribe-button';

export const OPENAI_DEFAULT_BASE_URL = 'https://api.openai.com/v1';
export const OPENAI_DEFAULT_MODEL = 'whisper-1';

export const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
export const GROQ_DEFAULT_MODEL = 'whisper-large-v3';

export const CUSTOM_DEFAULT_BASE_URL = OPENAI_DEFAULT_BASE_URL;
export const CUSTOM_DEFAULT_MODEL = OPENAI_DEFAULT_MODEL;

/** Get the base URL for the configured provider */
export const getBaseUrl = (
  settings: Settings['api'],
  fallback = CUSTOM_DEFAULT_BASE_URL,
) => {
  switch (settings.provider) {
    case 'openai':
      return OPENAI_DEFAULT_BASE_URL;
    case 'groq':
      return GROQ_BASE_URL;
    case 'custom':
      return settings.baseUrl ?? fallback;
  }
};

/** Get the default model for the configured provider */
export const getDefaultModel = (settings: Settings['api']) => {
  switch (settings.provider) {
    case 'openai':
      return OPENAI_DEFAULT_MODEL;
    case 'groq':
      return GROQ_DEFAULT_MODEL;
    case 'custom':
      return CUSTOM_DEFAULT_MODEL;
  }
};

export const useTranscription = (item: Item) => {
  const [transcription, setTranscription] = useState(() =>
    transcriptionCache.get(item.uniqueId),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [failureReason, setFailureReason] = useState<unknown | undefined>();

  const transcribeItem = useCallback(async () => {
    console.log('Transcribing item', item);
    const settings = loadSettings();

    if (
      (settings.api.provider === 'custom' &&
        settings.api.baseUrl === undefined) ||
      (settings.api.provider !== 'custom' && settings.api.token === '')
    ) {
      BdApi.UI.alert(
        'Invalid configuration',
        'Please configure your API access in the plugin settings.',
      );
      return;
    }

    try {
      setIsLoading(true);

      // Download the file
      const voiceNoteResponse = await fetch(item.originalItem.proxy_url);
      const voiceNoteBlob = await voiceNoteResponse.blob();

      // Run the transcription with the currently configured settings
      const formData = new FormData();
      formData.append('file', voiceNoteBlob, item.originalItem.filename);
      formData.append(
        'model',
        settings.api.model ?? getDefaultModel(settings.api),
      );

      const baseURL = getBaseUrl(settings.api);
      const openaiResponse = await fetch(`${baseURL}/audio/transcriptions`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${settings.api.token}`,
        },
      });
      const openaiResponseJson = await openaiResponse.json();
      if (!openaiResponse.ok) {
        throw openaiResponseJson;
      }

      transcriptionCache.set(item.uniqueId, openaiResponseJson.text);
      setTranscription(openaiResponseJson.text);
      setIsLoading(false);
      setIsError(false);
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      setFailureReason(e);
      console.error(e);
    }
  }, [item]);
  return {
    transcription,
    isLoading,
    isError,
    failureReason,
    transcribeItem,
  };
};
