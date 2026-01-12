import { bdApi } from './shared';

const SETTINGS_KEY = `settings`;

export const transcriptionCache: Map<string, string> = new Map();

export interface Settings {
  api: {
    type: 'openai';
    provider: 'custom' | 'openai' | 'groq';
    baseUrl: string | undefined;
    token: string;
    model: string | undefined;
  };
}

export type SettingsCategory = keyof Settings;

type PartialSettings = {
  [Category in keyof Settings]?: {
    [Key in keyof Settings[Category]]?: Settings[Category][Key];
  };
};

export const loadSettings = (): Settings => {
  const savedSettings: PartialSettings = bdApi.Data.load(SETTINGS_KEY) ?? {};

  const defaultSettings = {
    api: {
      type: 'openai',
      provider: 'custom',
      baseUrl: undefined,
      token: '',
      model: undefined,
    },
  } satisfies Settings;

  let category: keyof Settings;
  for (category in defaultSettings) {
    Object.assign(defaultSettings[category], savedSettings[category]);
  }

  return defaultSettings;
};

export const saveSetting = <T extends SettingsCategory>(
  category: T,
  id: keyof Settings[T],
  value: any
) => {
  if (
    (category === 'api' && id === 'baseUrl' && value === '') ||
    (category === 'api' && id === 'model' && value === '')
  ) {
    value = undefined;
  }

  const settings: PartialSettings = bdApi.Data.load(SETTINGS_KEY) ?? {};

  if (settings[category] === undefined) {
    settings[category] = {};
  }
  settings[category][id] = value;

  bdApi.Data.save(SETTINGS_KEY, settings);
};
