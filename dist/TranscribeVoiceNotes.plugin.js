/**
 * @name TranscribeVoiceNotes
 * @version 0.1.3
 * @author jh0ker
 * @authorId 325250926795554816
 * @description Transcribes voice notes in Discord using STT (speech-to-text). Requires your own API key (OpenAI or compatible API).
 */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(React) {
  "use strict";
  const buttonStyle = {
    height: "var(--custom-button-button-sm-height)",
    transition: "background-color var(--custom-button-transition-duration) ease, color var(--custom-button-transition-duration) ease",
    padding: "2px 16px",
    borderRadius: "3px",
    border: "none",
    fontSize: 14,
    lineHeight: "16px",
    backgroundColor: "var(--brand-500)",
    color: "var(--white-500)"
  };
  const bdApi = new BdApi("TranscribeVoiceNotes");
  const SETTINGS_KEY = `settings`;
  const transcriptionCache = /* @__PURE__ */ new Map();
  const loadSettings = () => {
    const savedSettings = bdApi.Data.load(SETTINGS_KEY) ?? {};
    const defaultSettings = {
      api: {
        type: "openai",
        provider: "custom",
        baseUrl: void 0,
        token: "",
        model: void 0
      }
    };
    let category;
    for (category in defaultSettings) {
      Object.assign(defaultSettings[category], savedSettings[category]);
    }
    return defaultSettings;
  };
  const saveSetting = (category, id, value) => {
    if (category === "api" && id === "baseUrl" && value === "" || category === "api" && id === "model" && value === "") {
      value = void 0;
    }
    const settings = bdApi.Data.load(SETTINGS_KEY) ?? {};
    if (settings[category] === void 0) {
      settings[category] = {};
    }
    settings[category][id] = value;
    bdApi.Data.save(SETTINGS_KEY, settings);
  };
  const OPENAI_DEFAULT_BASE_URL = "https://api.openai.com/v1";
  const OPENAI_DEFAULT_MODEL = "whisper-1";
  const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
  const GROQ_DEFAULT_MODEL = "whisper-large-v3";
  const CUSTOM_DEFAULT_BASE_URL = OPENAI_DEFAULT_BASE_URL;
  const CUSTOM_DEFAULT_MODEL = OPENAI_DEFAULT_MODEL;
  const getBaseUrl = (settings, fallback = CUSTOM_DEFAULT_BASE_URL) => {
    switch (settings.provider) {
      case "openai":
        return OPENAI_DEFAULT_BASE_URL;
      case "groq":
        return GROQ_BASE_URL;
      case "custom":
        return settings.baseUrl ?? fallback;
    }
  };
  const getDefaultModel = (settings) => {
    switch (settings.provider) {
      case "openai":
        return OPENAI_DEFAULT_MODEL;
      case "groq":
        return GROQ_DEFAULT_MODEL;
      case "custom":
        return CUSTOM_DEFAULT_MODEL;
    }
  };
  const useTranscription = (item) => {
    const [transcription, setTranscription] = React.useState(
      () => transcriptionCache.get(item.uniqueId)
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [failureReason, setFailureReason] = React.useState();
    const transcribeItem = React.useCallback(async () => {
      console.log("Transcribing item", item);
      const settings = loadSettings();
      if (settings.api.provider === "custom" && settings.api.baseUrl === void 0 || settings.api.provider !== "custom" && settings.api.token === "") {
        BdApi.UI.alert(
          "Invalid configuration",
          "Please configure your API access in the plugin settings."
        );
        return;
      }
      try {
        setIsLoading(true);
        const voiceNoteResponse = await fetch(item.originalItem.proxy_url);
        const voiceNoteBlob = await voiceNoteResponse.blob();
        const formData = new FormData();
        formData.append("file", voiceNoteBlob, item.originalItem.filename);
        formData.append(
          "model",
          settings.api.model ?? getDefaultModel(settings.api)
        );
        const baseURL = getBaseUrl(settings.api);
        const openaiResponse = await fetch(`${baseURL}/audio/transcriptions`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${settings.api.token}`
          }
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
      transcribeItem
    };
  };
  const TranscribeButton = ({ item }) => {
    if (item.type !== "AUDIO") {
      return /* @__PURE__ */ BdApi.React.createElement(React.Fragment, null);
    }
    const { transcription, isLoading, isError, failureReason, transcribeItem } = useTranscription(item);
    return /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "8px"
        }
      },
      /* @__PURE__ */ BdApi.React.createElement(
        "p",
        {
          style: {
            margin: 0,
            color: "var(--text-default)",
            lineHeight: "1.375rem",
            wordWrap: "break-word",
            whiteSpace: "break-spaces"
          }
        },
        isError && /* @__PURE__ */ BdApi.React.createElement(React.Fragment, null, "Error: ", /* @__PURE__ */ BdApi.React.createElement("br", null), /* @__PURE__ */ BdApi.React.createElement(
          "pre",
          {
            style: {
              fontFamily: '"Mononoki Nerd Font", Consolas, monospace',
              whiteSpace: "pre-wrap"
            }
          },
          JSON.stringify(failureReason, null, 2)
        )),
        transcription
      ),
      transcription === void 0 && /* @__PURE__ */ BdApi.React.createElement(
        "button",
        {
          onClick: transcribeItem,
          style: buttonStyle,
          disabled: isLoading
        },
        isLoading ? "Transcribing..." : "Transcribe"
      )
    );
  };
  const WithTranscribeButton = ({
    children,
    item
  }) => {
    return /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "8px"
        }
      },
      /* @__PURE__ */ BdApi.React.createElement("div", null, children),
      /* @__PURE__ */ BdApi.React.createElement(TranscribeButton, { item })
    );
  };
  const SettingsPanel = () => {
    const [panelKey, setPanelKey] = React.useState(0);
    const currentSettings = loadSettings();
    const settingsPanelConfig = makeSettingsPanelConfig(currentSettings);
    const handleClearCache = () => {
      transcriptionCache.clear();
      BdApi.UI.alert(
        "Success",
        "The transcription cache has been successfully cleared."
      );
    };
    const panel = BdApi.UI.buildSettingsPanel({
      settings: settingsPanelConfig,
      onChange: (category, id, value) => {
        if (category === null || id === null)
          return;
        saveSetting(category, id, value);
        if (id === "provider") {
          setPanelKey((n) => n + 1);
        }
      }
    });
    return /* @__PURE__ */ BdApi.React.createElement(React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement("div", { key: panelKey }, panel), /* @__PURE__ */ BdApi.React.createElement("button", { style: buttonStyle, onClick: handleClearCache }, "Clear transcription cache"));
  };
  function makeSettingsPanelConfig(currentSettings) {
    const provider = currentSettings.api.provider;
    const isPreset = provider === "openai" || provider === "groq";
    const baseUrlValue = getBaseUrl(currentSettings.api, "");
    const modelPlaceholder = getDefaultModel(currentSettings.api);
    let providerNote;
    switch (provider) {
      case "openai":
        providerNote = "OpenAI requires a paid API key from https://platform.openai.com";
        break;
      case "groq":
        providerNote = "Groq offers a free tier. See rate limits: https://console.groq.com/docs/rate-limits";
        break;
      default:
        providerNote = 'Select a provider preset or use "None" for custom OpenAI-compatible endpoints.';
        break;
    }
    let modelNote;
    switch (provider) {
      case "groq":
        modelNote = 'Groq supports "whisper-large-v3" and "whisper-large-v3-turbo". Leave empty for default.';
        break;
      case "openai":
      case "custom":
        modelNote = 'OpenAI supports "whisper-1", "gpt-4o-mini-transcribe" and "gpt-4o-transcribe". Leave empty for default.';
        break;
    }
    return [
      {
        type: "category",
        id: "api",
        name: "API Settings",
        collapsible: true,
        settings: [
          {
            type: "dropdown",
            id: "type",
            name: "API Type",
            note: "The API format to use. Currently, only OpenAI-compatible APIs are supported.",
            value: currentSettings.api.type,
            disabled: true,
            options: [{ label: "OpenAI-compatible", value: "openai" }]
          },
          {
            type: "dropdown",
            id: "provider",
            name: "Provider Preset",
            note: providerNote,
            value: currentSettings.api.provider,
            options: [
              { label: "None (Custom)", value: "custom" },
              { label: "OpenAI", value: "openai" },
              { label: "Groq (Free tier available)", value: "groq" }
            ]
          },
          {
            type: "text",
            id: "baseUrl",
            name: "Base URL",
            note: isPreset ? "Base URL is set by the provider preset." : "The base URL of the API. Leave empty for OpenAI default.",
            value: baseUrlValue,
            placeholder: CUSTOM_DEFAULT_BASE_URL,
            disabled: isPreset
          },
          {
            type: "text",
            id: "token",
            name: "API Key",
            note: "Your API token. Will be stored unencrypted on your computer." + (provider === "custom" ? "" : " Required."),
            value: currentSettings.api.token
          },
          {
            type: "text",
            id: "model",
            name: "Model",
            note: modelNote,
            value: currentSettings.api.model ?? "",
            placeholder: modelPlaceholder
          }
        ]
      }
    ];
  }
  class TranscribeVoiceNotes {
    constructor(meta) {
      __publicField(this, "meta");
      this.meta = meta;
    }
    start() {
      var _a;
      this.migrate();
      const voiceNoteFilter = bdApi.Webpack.Filters.byStrings(
        ".duration_secs",
        ".waveform",
        ".url"
      );
      const VoiceNoteComponent = bdApi.Webpack.getModule(voiceNoteFilter, {
        searchExports: true
      });
      const VoiceNoteModule = bdApi.Webpack.getModule(
        (m) => Object.values(m).includes(VoiceNoteComponent)
      );
      const voiceNoteComponentKey = (_a = Object.entries(VoiceNoteModule).find(
        ([key, value]) => value === VoiceNoteComponent
      )) == null ? void 0 : _a[0];
      if (!voiceNoteComponentKey) {
        console.error("Could not find voiceNoteComponentKey");
        return;
      }
      bdApi.Patcher.instead(
        VoiceNoteModule,
        voiceNoteComponentKey,
        (thisObject, methodArguments, OriginalComponent) => {
          const originalNode = OriginalComponent(...methodArguments);
          try {
            const props = methodArguments[0];
            if (!("item" in props)) {
              return originalNode;
            }
            const item = props["item"];
            return /* @__PURE__ */ BdApi.React.createElement(WithTranscribeButton, { item }, originalNode);
          } catch (e) {
            console.error(e);
            return originalNode;
          }
        }
      );
    }
    stop() {
      bdApi.Patcher.unpatchAll();
    }
    getSettingsPanel() {
      return SettingsPanel;
    }
    migrate() {
      const versionKey = "version";
      const previousVersion = bdApi.Data.load(versionKey);
      const currentVersion = this.meta.version;
      console.debug("Previous version", previousVersion);
      console.debug("Current version", currentVersion);
      if (previousVersion === void 0) {
        console.log("First run");
        bdApi.Data.save(versionKey, currentVersion);
        return;
      } else if (previousVersion === currentVersion) {
        console.log("No migration needed");
        return;
      }
      console.log("Migrating from version", previousVersion, "to", currentVersion);
      if (bdApi.Utils.semverCompare(previousVersion, "0.1.3") < 0) {
        console.log("Applying migration to version 0.1.3");
        bdApi.Data.delete("transcriptionCache");
      }
      console.log("Finished migrations");
      bdApi.Data.save(versionKey, currentVersion);
    }
  }
  module.exports = TranscribeVoiceNotes;
})(BdApi.React);
