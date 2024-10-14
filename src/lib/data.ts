import { bdApi } from './shared';

export const loadTranscription = (itemId: string) => {
  const transcription = bdApi.Data.load(`transcription-${itemId}`);
  if (transcription) {
    return transcription as string;
  }
};

export const saveTranscription = (itemId: string, transcription: string) => {
  bdApi.Data.save(`transcription-${itemId}`, transcription);
};
