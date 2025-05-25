import React, { useCallback, useState } from 'react';

import { openaiClient } from '../lib/shared';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [failureReason, setFailureReason] = useState<unknown | undefined>();

  const transcribeItem = useCallback(async () => {
    console.log('Transcribing item', item);
    setIsLoading(true);
    const settings = loadSettings();

    if (settings.api.baseUrl === undefined && settings.api.token === '') {
      BdApi.UI.alert(
        'Invalid configuration',
        'Please configure your API access in the plugin settings.'
      );
      return;
    }

    try {
      // Download the file
      const voiceNoteResponse = await fetch(item.originalItem.proxy_url);
      const voiceNoteBlob = await voiceNoteResponse.blob();
      const voiceNoteFile = new File(
        [voiceNoteBlob],
        item.originalItem.filename
      );

      // Run the transcription with the currently configured settings
      openaiClient.baseURL =
        settings.api.baseUrl ?? 'https://api.openai.com/v1';
      openaiClient.apiKey = settings.api.token;

      const openaiResponse = await openaiClient.audio.transcriptions.create({
        file: voiceNoteFile,
        model: settings.api.model,
      });

      saveTranscription(item.uniqueId, openaiResponse.text);
      setTranscription(openaiResponse.text);
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
