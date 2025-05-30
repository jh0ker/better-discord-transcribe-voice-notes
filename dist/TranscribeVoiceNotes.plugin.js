/**
 * @name TranscribeVoiceNotes
 * @version 0.1.1
 * @author jh0ker
 * @authorId 325250926795554816
 * @description Transcribes voice notes in Discord using STT (speech-to-text). Requires your own OpenAI API key (or compatible API).
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
  const CACHE_KEY = `transcriptionCache`;
  const SETTINGS_KEY = `settings`;
  const loadTranscription = (itemId) => {
    const transcriptionCache = bdApi.Data.load(CACHE_KEY);
    if (transcriptionCache) {
      return transcriptionCache[itemId];
    }
  };
  const saveTranscription = (itemId, transcription) => {
    const transcriptionCache = bdApi.Data.load(CACHE_KEY) ?? {};
    transcriptionCache[itemId] = transcription;
    bdApi.Data.save(CACHE_KEY, transcriptionCache);
  };
  const clearTranscriptionCache = () => {
    bdApi.Data.save(CACHE_KEY, {});
  };
  const loadSettings = () => {
    const savedSettings = bdApi.Data.load(SETTINGS_KEY) ?? {};
    const defaultSettings = {
      api: {
        type: "openai",
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
  const useTranscription = (item) => {
    const [transcription, setTranscription] = React.useState(
      () => loadTranscription(item.uniqueId)
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [failureReason, setFailureReason] = React.useState();
    const transcribeItem = React.useCallback(async () => {
      console.log("Transcribing item", item);
      const settings = loadSettings();
      if (settings.api.baseUrl === void 0 && settings.api.token === "") {
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
        formData.append("model", settings.api.model ?? OPENAI_DEFAULT_MODEL);
        const baseURL = settings.api.baseUrl ?? OPENAI_DEFAULT_BASE_URL;
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
            color: "var(--text-normal)",
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
    const currentSettings = loadSettings();
    const settingsPanelConfig = makeSettingsPanelConfig(currentSettings);
    const handleClearCache = () => {
      clearTranscriptionCache();
      BdApi.UI.alert(
        "Success",
        "The transcription cache has been successfully cleared."
      );
    };
    const panel = BdApi.UI.buildSettingsPanel({
      settings: settingsPanelConfig,
      // @ts-expect-error - TODO: Proper typing would require validation
      onChange: (category, id, value) => saveSetting(category, id, value)
    });
    return /* @__PURE__ */ BdApi.React.createElement(React.Fragment, null, panel, /* @__PURE__ */ BdApi.React.createElement("button", { style: buttonStyle, onClick: handleClearCache }, "Clear transcription cache"));
  };
  function makeSettingsPanelConfig(currentSettings) {
    return [
      {
        type: "category",
        id: "api",
        name: "API Settings",
        collapsible: true,
        settings: [
          {
            type: "dropdown",
            id: "api-type",
            name: "API Type",
            note: "Currently, only OpenAI or compatible is supported.",
            value: currentSettings.api.type,
            disabled: true,
            options: [{ label: "OpenAI", value: "openai" }]
          },
          {
            type: "text",
            id: "baseUrl",
            name: "Base URL",
            note: "The base URL of the API. Leave empty for default.",
            value: currentSettings.api.baseUrl ?? "",
            placeholder: OPENAI_DEFAULT_BASE_URL
          },
          {
            type: "text",
            id: "token",
            name: "Token",
            note: "The token to use for the API. Will be stored unencrypted on your computer. Required.",
            value: currentSettings.api.token
          },
          {
            type: "text",
            id: "model",
            name: "Model",
            note: 'The model to use. OpenAI currently supports "whisper-1", "gpt-4o-mini-transcribe" and "gpt-4o-transcribe". Leave empty for default.',
            value: currentSettings.api.model ?? "",
            placeholder: OPENAI_DEFAULT_MODEL
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
      bdApi.Data.save("version", this.meta.version);
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
  }
  module.exports = TranscribeVoiceNotes;
})(BdApi.React);
