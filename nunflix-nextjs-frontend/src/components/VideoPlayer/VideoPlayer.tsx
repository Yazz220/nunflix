import React, { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import type { ReactPlayerProps } from 'react-player';

const Player = dynamic(() => import('react-player/lazy'), { ssr: false });

const VideoPlayer = (
  props: ReactPlayerProps,
  ref: React.ForwardedRef<any>
) => {
  return <Player {...props} ref={ref} />;
};

export default forwardRef(VideoPlayer);
