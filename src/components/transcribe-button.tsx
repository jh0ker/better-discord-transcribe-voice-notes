import React from 'react';

const TranscribeButton: React.FC = () => {
  return <button>Transcribe</button>;
};

export const WithTranscribeButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      {children}
      <TranscribeButton />
    </div>
  );
};
