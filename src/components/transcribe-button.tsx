import React, { useCallback, useState } from 'react';

import {
  loadSettings,
  loadTranscription,
  saveTranscription,
} from '../lib/data';
import { buttonStyle } from '../lib/style';
import {
  OPENAI_DEFAULT_BASE_URL,
  OPENAI_DEFAULT_MODEL,
} from '../lib/transcription';

type OriginalItem = {
  content_scan_version: Number;
  content_type: string;
  duration_secs: Number;
  filename: string;
  id: string;
  proxy_url: string;
  size: Number;
  spoiler: boolean;
  url: string;
  waveform: string;
};

export type Item = {
  uniqueId: string;
  originalItem: OriginalItem;
  contentType: string;
  downloadUrl: string;
  spoiler: boolean;
  type: 'AUDIO' | 'VIDEO';
  width?: Number;
  height?: Number;
};

export type TranscribeButtonProps = {
  item: Item;
};

const TranscribeButton: React.FC<TranscribeButtonProps> = ({ item }) => {
  if (item.type !== 'AUDIO') {
    return <React.Fragment></React.Fragment>;
  }

  const [transcription, setTranscription] = useState(
    loadTranscription(item.uniqueId)
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

      saveTranscription(item.uniqueId, openaiResponseJson.text);
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

  return (
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '8px',
        } as const
      }
    >
      <p
        style={
          {
            margin: 0,
            color: 'var(--text-normal)',
            lineHeight: '1.375rem',
            wordWrap: 'break-word',
            whiteSpace: 'break-spaces',
          } as const
        }
      >
        {isError && (
          <React.Fragment>
            Error: <br />
            <pre
              style={{
                fontFamily: '"Mononoki Nerd Font", Consolas, monospace',
                whiteSpace: 'pre-wrap',
              }}
            >
              {JSON.stringify(failureReason, null, 2)}
            </pre>
          </React.Fragment>
        )}
        {transcription}
      </p>
      {transcription === undefined && (
        <button
          onClick={transcribeItem}
          style={buttonStyle}
          disabled={isLoading}
        >
          {isLoading ? 'Transcribing...' : 'Transcribe'}
        </button>
      )}
    </div>
  );
};

export type WithTranscribeButtonProps = {
  children: React.ReactNode;
  item: Item;
};

export const WithTranscribeButton: React.FC<WithTranscribeButtonProps> = ({
  children,
  item,
}) => {
  return (
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '8px',
        } as const
      }
    >
      <div>{children}</div>
      <TranscribeButton item={item} />
    </div>
  );
};
