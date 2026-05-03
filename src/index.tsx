import type { Meta, Plugin } from 'betterdiscord/plugin';

import { Item, WithTranscribeButton } from './components/transcribe-button';
import { SettingsPanel } from './components/settings-panel';
import { bdApi } from './lib/shared';

import styles from './styles.css?raw';

class TranscribeVoiceNotes implements Plugin {
  meta: Meta;
  abortControllerModuleSearch: AbortController | undefined;

  constructor(meta: Meta) {
    this.meta = meta;
  }

  async start(): Promise<void> {
    this.migrate();
    // --- Styles ---
    bdApi.DOM.addStyle(this.meta.name, styles);

    // --- Patches ---
    const voiceNoteFilter = bdApi.Webpack.Filters.byStrings(
      '.duration_secs',
      '.waveform',
      '.url',
    );

    this.abortControllerModuleSearch?.abort();
    this.abortControllerModuleSearch = new AbortController();
    const timeoutSignal = AbortSignal.timeout(3000);
    const VoiceNoteComponent = await bdApi.Webpack.waitForModule(
      voiceNoteFilter,
      {
        searchExports: true,
        signal: AbortSignal.any([
          this.abortControllerModuleSearch.signal,
          timeoutSignal,
        ]),
      },
    );

    if (this.abortControllerModuleSearch.signal.aborted) {
      console.warn('Plugin loading aborted');
      return;
    } else if (VoiceNoteComponent === undefined) {
      console.error('Could not find VoiceNoteComponent');
      this.showPluginLoadingError();
      return;
    }

    const VoiceNoteModule: any = bdApi.Webpack.getModule((m) =>
      Object.values(m).includes(VoiceNoteComponent),
    );

    if (VoiceNoteModule === undefined) {
      console.error('Could not find VoiceNoteModule');
      this.showPluginLoadingError();
      return;
    }
    // console.log('VoiceNoteModule', VoiceNoteModule);

    const voiceNoteComponentKey = Object.entries(VoiceNoteModule).find(
      ([key, value]) => value === VoiceNoteComponent,
    )?.[0];
    // console.log('voiceNoteComponentKey', voiceNoteComponentKey);

    if (!voiceNoteComponentKey) {
      console.error('Could not find voiceNoteComponentKey');
      this.showPluginLoadingError();
      return;
    }

    // console.log(
    //   'VoiceNoteModule[voiceNoteComponentKey]',
    //   VoiceNoteModule[voiceNoteComponentKey]
    // );

    bdApi.Patcher.instead(
      VoiceNoteModule,
      voiceNoteComponentKey,
      (thisObject, methodArguments, OriginalComponent) => {
        // console.log('thisObject', thisObject);
        // console.log('methodArguments', methodArguments);
        // console.log('returnValue', OriginalComponent);

        const originalNode = OriginalComponent(...methodArguments);

        try {
          const props = methodArguments[0] as Record<string, unknown>;

          if (!('item' in props)) {
            return originalNode;
          }

          const item = props['item'] as Item;

          return (
            <WithTranscribeButton item={item}>
              {originalNode}
            </WithTranscribeButton>
          );
        } catch (e) {
          console.error(e);
          return originalNode;
        }
      },
    );
  }

  stop(): void {
    this.abortControllerModuleSearch?.abort();
    bdApi.Patcher.unpatchAll();
    bdApi.DOM.removeStyle(this.meta.name);
  }

  getSettingsPanel() {
    return SettingsPanel;
  }

  migrate() {
    const versionKey = 'version';
    const previousVersion = bdApi.Data.load(versionKey);
    const currentVersion = this.meta.version;
    console.debug('Previous version', previousVersion);
    console.debug('Current version', currentVersion);

    if (previousVersion === undefined) {
      console.log('First run');
      bdApi.Data.save(versionKey, currentVersion);
      return;
    } else if (previousVersion === currentVersion) {
      console.log('No migration needed');
      return;
    }

    console.log(
      'Migrating from version',
      previousVersion,
      'to',
      currentVersion,
    );

    if (bdApi.Utils.semverCompare(previousVersion, '0.1.3') < 0) {
      console.log('Applying migration to version 0.1.3');
      // Clear previously stored transcriptions
      bdApi.Data.delete('transcriptionCache');
    }

    console.log('Finished migrations');
    bdApi.Data.save(versionKey, currentVersion);
  }

  /** Show errors during load manually, since BetterDiscord swallows them if `start` is async. */
  showPluginLoadingError() {
    bdApi.UI.showToast('TranscribeVoiceNotes failed to load', {
      type: 'error',
      icon: true,
    });
  }
}

module.exports = TranscribeVoiceNotes;
