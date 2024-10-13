import React from 'react';
import { BoundBdApi } from 'betterdiscord';

import { Plugin } from './bd';
import { WithTranscribeButton } from './components/transcribe-button';

module.exports = class extends Plugin {
  private bdApi: BoundBdApi;

  constructor() {
    super();
    this.bdApi = new BdApi('TranscribeVoiceNotes');
  }

  protected start(): void {
    this.bdApi.UI.alert('Hello World!', <div>Hello World!</div>);

    const voiceNoteFilter = this.bdApi.Webpack.Filters.byStrings(
      '.duration_secs',
      '.waveform',
      '.url'
    );
    const VoiceNoteComponent = this.bdApi.Webpack.getModule(voiceNoteFilter, {
      searchExports: true,
    });
    // console.log('VoiceNoteComponent', VoiceNoteComponent);

    const VoiceNoteModule = this.bdApi.Webpack.getModule((m) =>
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

    this.bdApi.Patcher.instead(
      VoiceNoteModule,
      voiceNoteComponentKey,
      (thisObject, methodArguments, OriginalComponent) => {
        // console.log('thisObject', thisObject);
        // console.log('methodArguments', methodArguments);
        // console.log('returnValue', originalComponent);
        return (
          <WithTranscribeButton>
            {OriginalComponent(...methodArguments)}
          </WithTranscribeButton>
        );
      }
    );
  }

  protected stop(): void {
    this.bdApi.Patcher.unpatchAll();
  }
};
