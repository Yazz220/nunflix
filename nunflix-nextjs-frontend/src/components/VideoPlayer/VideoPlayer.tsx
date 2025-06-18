import React from 'react';
import ReactPlayer from 'react-player/lazy';
import type { ReactPlayerProps } from 'react-player/lazy';

const VideoPlayer = React.forwardRef<ReactPlayer, ReactPlayerProps>((props, ref) => {
  return <ReactPlayer {...props} ref={ref} />;
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;