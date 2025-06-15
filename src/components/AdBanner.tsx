import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="w-full bg-gray-800 text-white text-center py-4 rounded-lg my-8 flex items-center justify-center">
      <span className="text-lg font-bold mr-2">ADVERTISEMENT</span>
      <span className="text-gray-400">Your ad here! (Placeholder)</span>
    </div>
  );
};

export default AdBanner; 