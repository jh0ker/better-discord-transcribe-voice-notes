import React, { useCallback, useState } from 'react';
import { useMutation, QueryClientProvider } from '@tanstack/react-query';

import { openaiClient, queryClient } from '../lib/shared';
import {
  loadSettings,
  loadTranscription,
  saveTranscription,
} from '../lib/data';
import { buttonStyle } from '../lib/style';

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

    // Download the file
    const voiceNoteResponse = await fetch(item.originalItem.proxy_url);
    const voiceNoteBlob = await voiceNoteResponse.blob();
    const voiceNoteFile = new File([voiceNoteBlob], item.originalItem.filename);

    // Run the transcription with the currently configured settings
    openaiClient.baseURL = settings.api.baseUrl ?? 'https://api.openai.com/v1';
    openaiClient.apiKey = settings.api.token;

    const openaiResponse = await openaiClient.audio.transcriptions.create({
      file: voiceNoteFile,
      model: settings.api.model,
    });

    saveTranscription(item.uniqueId, openaiResponse.text);
    setTranscription(openaiResponse.text);

    return openaiResponse.text;
  }, [item]);

  const { isLoading, isError, failureReason, mutate } = useMutation(
    ['transcribe', item.uniqueId],
    transcribeItem
  );

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
          onClick={() => mutate()}
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
      <QueryClientProvider client={queryClient}>
        <TranscribeButton item={item} />
      </QueryClientProvider>
    </div>
  );
};
