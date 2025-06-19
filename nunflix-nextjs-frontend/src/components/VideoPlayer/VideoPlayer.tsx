import React, { forwardRef } from 'react';
import Player from 'react-player/lazy';

const VideoPlayer = (props: any, ref: any) => {
  return <Player {...props} ref={ref} />;
};

export default forwardRef(VideoPlayer);