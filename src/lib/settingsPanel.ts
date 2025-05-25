import type { SettingsPanelSetting } from 'betterdiscord';
import { loadSettings, saveSetting, Settings } from './data';

export const buildSettingsPanel = () => {
  const currentSettings = loadSettings();
  const settingsPanelConfig = makeSettingsPanelConfig(currentSettings);

  return BdApi.UI.buildSettingsPanel({
    settings: settingsPanelConfig,
    // @ts-expect-error - TODO: Proper typing would require validation
    onChange: (category, id, value) => saveSetting(category, id, value),
  });
};

function makeSettingsPanelConfig(currentSettings: Settings) {
  return [
    {
      type: 'category',
      id: 'api',
      name: 'API Settings',
      collapsible: true,
      settings: [
        {
          type: 'dropdown',
          id: 'api-type',
          name: 'API Type',
          note: 'Currently, only OpenAI or compatible is supported.',
          value: currentSettings.api.type,
          disabled: true,
          options: [{ label: 'OpenAI', value: 'openai' }],
        },
        {
          type: 'text',
          id: 'baseUrl',
          name: 'Base URL',
          note: 'The base URL of the API. Leave empty for default.',
          value: currentSettings.api.baseUrl ?? '',
        },
        {
          type: 'text',
          id: 'token',
          name: 'Token',
          note: 'The token to use for the API. Will be stored unencrypted on your computer. Required.',
          value: currentSettings.api.token,
        },
        {
          type: 'text',
          id: 'model',
          name: 'Model',
          note: 'The model to use. OpenAI currently supports "whisper-1", "gpt-4o-mini-transcribe" and "gpt-4o-transcribe".',
          value: currentSettings.api.model,
        },
      ],
    },
  ] satisfies SettingsPanelSetting[];
}
