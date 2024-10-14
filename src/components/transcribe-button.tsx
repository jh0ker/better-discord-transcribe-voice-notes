import React, { useCallback, useState } from 'react';
import { useMutation, QueryClientProvider } from '@tanstack/react-query';

import { openaiClient, queryClient } from '../lib/shared';
import { loadTranscription, saveTranscription } from '../lib/data';

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

    // Download the file
    const voiceNoteResponse = await fetch(item.originalItem.proxy_url);
    const voiceNoteBlob = await voiceNoteResponse.blob();
    const voiceNoteFile = new File([voiceNoteBlob], item.originalItem.filename);

    // Run the transcription
    const openaiResponse = await openaiClient.audio.transcriptions.create({
      file: voiceNoteFile,
      model: 'whisper-1',
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '8px',
      }}
    >
      <p
        style={{
          margin: 0,
          color: 'var(--text-normal)',
          lineHeight: '1.375rem',
          wordWrap: 'break-word',
          whiteSpace: 'break-spaces',
        }}
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
          style={{
            height: 'var(--custom-button-button-sm-height)',
            transition:
              'background-color var(--custom-button-transition-duration) ease, color var(--custom-button-transition-duration) ease',
            padding: '2px 16px',
            borderRadius: '3px',
            border: 'none',
            fontSize: 14,
            lineHeight: '16px',
            backgroundColor: 'var(--brand-500)',
            color: 'var(--white-500)',
          }}
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '8px',
      }}
    >
      <div>{children}</div>
      <QueryClientProvider client={queryClient}>
        <TranscribeButton item={item} />
      </QueryClientProvider>
    </div>
  );
};
