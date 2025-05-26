import { bdApi } from './shared';

const CACHE_KEY = `transcriptionCache`;
const SETTINGS_KEY = `settings`;

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

export const clearTranscriptionCache = () => {
  bdApi.Data.save(CACHE_KEY, {});
};

export interface Settings {
  api: {
    type: 'openai';
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
