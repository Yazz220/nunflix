import React, { forwardRef } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';

interface VideoPlayerProps extends ReactPlayerProps {
  // This interface is intentionally left empty to allow for future customization.
}

const VideoPlayer = forwardRef<ReactPlayer, VideoPlayerProps>((props, ref) => {
  return <ReactPlayer {...props} ref={ref} />;
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
