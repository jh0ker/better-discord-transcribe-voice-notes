import React, { useState } from 'react';
import type { SettingsPanelSetting } from 'betterdiscord';

import {
  transcriptionCache,
  loadSettings,
  saveSetting,
  Settings,
} from '../lib/data';
import {
  getBaseUrl,
  getDefaultModel,
  CUSTOM_DEFAULT_BASE_URL,
} from '../lib/transcription';

export const SettingsPanel: React.FC = () => {
  const [panelKey, setPanelKey] = useState(0);

  const currentSettings = loadSettings();
  const settingsPanelConfig = makeSettingsPanelConfig(currentSettings);

  const handleClearCache = () => {
    transcriptionCache.clear();
    BdApi.UI.alert(
      'Success',
      'The transcription cache has been successfully cleared.'
    );
  };

  const panel = BdApi.UI.buildSettingsPanel({
    settings: settingsPanelConfig,
    onChange: (category, id, value) => {
      if (category === null || id === null) return;
      // @ts-expect-error - TODO: Proper typing would require validation
      saveSetting(category, id, value);
      // When provider changes, force recreation of panel
      if (id === 'provider') {
        setPanelKey((n) => n + 1);
      }
    },
  });

  return (
    <React.Fragment>
      <div key={panelKey}>{panel}</div>
      <BdApi.Components.Button onClick={handleClearCache}>
        Clear transcription cache
      </BdApi.Components.Button>
    </React.Fragment>
  );
};

function makeSettingsPanelConfig(currentSettings: Settings) {
  const provider = currentSettings.api.provider;
  const isPreset = provider === 'openai' || provider === 'groq';

  const baseUrlValue = getBaseUrl(currentSettings.api, '');
  const modelPlaceholder = getDefaultModel(currentSettings.api);

  let providerNote: React.ReactNode;
  switch (provider) {
    case 'openai':
      providerNote = (
        <span>
          OpenAI requires a paid API key from{' '}
          <a href="https://platform.openai.com/" target="_blank">
            https://platform.openai.com/
          </a>
          .
        </span>
      );
      break;
    case 'groq':
      providerNote = (
        <span>
          Groq offers a free tier. See{' '}
          <a
            href="https://console.groq.com/docs/rate-limits#rate-limits"
            target="_blank"
          >
            https://console.groq.com/docs/rate-limits
          </a>
          .
        </span>
      );
      break;
    default:
      providerNote =
        'Select a provider preset or use "None" for custom OpenAI-compatible endpoints.';
      break;
  }

  let modelNote: string;
  switch (provider) {
    case 'groq':
      modelNote =
        'Groq supports "whisper-large-v3" and "whisper-large-v3-turbo". Leave empty for default.';
      break;
    case 'openai':
    case 'custom':
      modelNote =
        'OpenAI supports "whisper-1", "gpt-4o-mini-transcribe" and "gpt-4o-transcribe". Leave empty for default.';
      break;
  }

  return [
    {
      type: 'category',
      id: 'api',
      name: 'API Settings',
      collapsible: true,
      settings: [
        {
          type: 'dropdown',
          id: 'type',
          name: 'API Type',
          note: 'The API format to use. Currently, only OpenAI-compatible APIs are supported.',
          value: currentSettings.api.type,
          disabled: true,
          options: [{ label: 'OpenAI-compatible', value: 'openai' }],
        },
        {
          type: 'dropdown',
          id: 'provider',
          name: 'Provider Preset',
          note: providerNote as string,
          value: currentSettings.api.provider,
          options: [
            { label: 'None (Custom)', value: 'custom' },
            { label: 'OpenAI', value: 'openai' },
            { label: 'Groq (Free tier available)', value: 'groq' },
          ],
        },
        {
          type: 'text',
          id: 'baseUrl',
          name: 'Base URL',
          note: isPreset
            ? 'Base URL is set by the provider preset.'
            : 'The base URL of the API. Leave empty for OpenAI default.',
          value: baseUrlValue,
          placeholder: CUSTOM_DEFAULT_BASE_URL,
          disabled: isPreset,
        },
        {
          type: 'text',
          id: 'token',
          name: 'API Key',
          note:
            'Your API token. Will be stored unencrypted on your computer.' +
            (provider === 'custom' ? '' : ' Required.'),
          value: currentSettings.api.token,
        },
        {
          type: 'text',
          id: 'model',
          name: 'Model',
          note: modelNote,
          value: currentSettings.api.model ?? '',
          placeholder: modelPlaceholder,
        },
      ],
    },
  ] satisfies SettingsPanelSetting[];
}
