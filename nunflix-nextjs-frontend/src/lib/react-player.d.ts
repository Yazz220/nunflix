declare module 'react-player' {
  import * as React from 'react';

  export interface ReactPlayerProps {
    url?: string | string[] | null;
    playing?: boolean;
    loop?: boolean;
    controls?: boolean;
    light?: boolean | string;
    volume?: number | null;
    muted?: boolean;
    playbackRate?: number;
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    progressInterval?: number;
    playsinline?: boolean;
    pip?: boolean;
    stopOnUnmount?: boolean;
    fallback?: React.ReactElement;
    wrapper?: React.ElementType;
    playIcon?: React.ReactElement;
    previewTabIndex?: number;
    config?: {
      [key: string]: unknown;
    };
    onReady?: (player: ReactPlayer) => void;
    onStart?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onBuffer?: () => void;
    onBufferEnd?: () => void;
    onSeek?: (seconds: number) => void;
    onEnded?: () => void;
    onError?: (error: Error, data?: unknown, hlsInstance?: unknown, hlsGlobal?: unknown) => void;
    onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
    onDuration?: (duration: number) => void;
  }

  export default class ReactPlayer extends React.Component<ReactPlayerProps> {
    seekTo(amount: number, type?: 'seconds' | 'fraction'): void;
    getCurrentTime(): number;
    getDuration(): number;
    getInternalPlayer(key?: string): unknown;
    showPreview(): void;
  }
}

declare module 'react-player/lazy' {
  import ReactPlayer, { ReactPlayerProps } from 'react-player';
  export default ReactPlayer;
  export { ReactPlayerProps };
}
