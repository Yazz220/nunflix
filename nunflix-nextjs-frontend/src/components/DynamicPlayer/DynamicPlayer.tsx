import dynamic from 'next/dynamic';

const DynamicPlayer = dynamic(() => import('react-player'), {
  ssr: false,
});

export default DynamicPlayer;