import React, { forwardRef } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';

interface VideoPlayerProps extends ReactPlayerProps {
  // Add any additional props you want to expose
}

const VideoPlayer = forwardRef<ReactPlayer, VideoPlayerProps>((props, ref) => {
  return <ReactPlayer {...props} ref={ref} />;
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
