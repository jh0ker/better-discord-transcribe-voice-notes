import { useCallback, useState } from 'react';

import { loadSettings, transcriptionCache } from './data';
import type { Item } from '../components/transcribe-button';

export const OPENAI_DEFAULT_BASE_URL = 'https://api.openai.com/v1';
export const OPENAI_DEFAULT_MODEL = 'whisper-1';

export const useTranscription = (item: Item) => {
  const [transcription, setTranscription] = useState(() =>
    transcriptionCache.get(item.uniqueId)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [failureReason, setFailureReason] = useState<unknown | undefined>();

  const transcribeItem = useCallback(async () => {
    console.log('Transcribing item', item);
    const settings = loadSettings();

    if (settings.api.baseUrl === undefined && settings.api.token === '') {
      BdApi.UI.alert(
        'Invalid configuration',
        'Please configure your API access in the plugin settings.'
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
      formData.append('model', settings.api.model ?? OPENAI_DEFAULT_MODEL);

      const baseURL = settings.api.baseUrl ?? OPENAI_DEFAULT_BASE_URL;
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
