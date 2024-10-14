import { Plugin } from './bd';
import { Item, WithTranscribeButton } from './components/transcribe-button';
import { bdApi } from './lib/shared';

module.exports = class extends Plugin {
  constructor() {
    super();
  }

  protected start(): void {
    const voiceNoteFilter = bdApi.Webpack.Filters.byStrings(
      '.duration_secs',
      '.waveform',
      '.url'
    );
    const VoiceNoteComponent = bdApi.Webpack.getModule(voiceNoteFilter, {
      searchExports: true,
    });
    // console.log('VoiceNoteComponent', VoiceNoteComponent);

    const VoiceNoteModule = bdApi.Webpack.getModule((m) =>
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
        // console.log('returnValue', originalComponent);
        try {
          const props = methodArguments[0] as Record<string, unknown>;

          if (!('item' in props)) {
            return OriginalComponent(...methodArguments);
          }

          const item = props['item'] as Item;

          return (
            <WithTranscribeButton item={item}>
              {OriginalComponent(...methodArguments)}
            </WithTranscribeButton>
          );
        } catch (e) {
          console.error(e);
          return OriginalComponent(...methodArguments);
        }
      }
    );
  }

  protected stop(): void {
    bdApi.Patcher.unpatchAll();
  }
};
