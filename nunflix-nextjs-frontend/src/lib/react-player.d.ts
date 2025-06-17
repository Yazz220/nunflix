declare module 'react-player' {
  import { Component } from 'react';
  import { ReactPlayerProps } from 'react-player';

  interface ReactPlayer extends Component<ReactPlayerProps> {
    seekTo(amount: number, type?: 'seconds' | 'fraction'): void;
    getCurrentTime(): number;
    getDuration(): number;
    setVolume(fraction: number): void;
    // Add other methods you use from ReactPlayer
  }

  export default ReactPlayer;
}

declare module 'react-player/lazy' {
  import { Component } from 'react';
  import { ReactPlayerProps } from 'react-player';

  interface ReactPlayer extends Component<ReactPlayerProps> {
    seekTo(amount: number, type?: 'seconds' | 'fraction'): void;
    getCurrentTime(): number;
    getDuration(): number;
    setVolume(fraction: number): void;
    // Add other methods you use from ReactPlayer
  }

  export default ReactPlayer;
} 