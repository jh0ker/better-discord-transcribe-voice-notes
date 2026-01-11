import type { Meta, Plugin } from 'betterdiscord/plugin';

import { Item, WithTranscribeButton } from './components/transcribe-button';
import { SettingsPanel } from './components/settings-panel';
import { bdApi } from './lib/shared';

class TranscribeVoiceNotes implements Plugin {
  meta: Meta;

  constructor(meta: Meta) {
    this.meta = meta;
  }

  start(): void {
    this.migrate();

    // --- Patches ---
    const voiceNoteFilter = bdApi.Webpack.Filters.byStrings(
      '.duration_secs',
      '.waveform',
      '.url'
    );
    const VoiceNoteComponent = bdApi.Webpack.getModule(voiceNoteFilter, {
      searchExports: true,
    });
    // console.log('VoiceNoteComponent', VoiceNoteComponent);

    const VoiceNoteModule: any = bdApi.Webpack.getModule((m) =>
      Object.values(m).includes(VoiceNoteComponent)
    );
    // console.log('VoiceNoteModule', VoiceNoteModule);

    const voiceNoteComponentKey = Object.entries(VoiceNoteModule).find(
      ([key, value]) => value === VoiceNoteComponent
    )?.[0];
    // console.log('voiceNoteComponentKey', voiceNoteComponentKey);

    if (!voiceNoteComponentKey) {
      console.error('Could not find voiceNoteComponentKey');
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
      }
    );
  }

  stop(): void {
    bdApi.Patcher.unpatchAll();
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

    console.log('Migrating from version', previousVersion, 'to', currentVersion);

    if (bdApi.Utils.semverCompare(previousVersion, '0.1.3') < 0) {
      console.log('Applying migration to version 0.1.3');
      // Clear previously stored transcriptions
      bdApi.Data.delete('transcriptionCache');
    }

    console.log('Finished migrations');
    bdApi.Data.save(versionKey, currentVersion);
  }
}

module.exports = TranscribeVoiceNotes;
