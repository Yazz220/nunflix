import React from 'react';
import useStore from '../store/useStore';
import ContentCard from '../components/ContentCard';

const WatchHistory: React.FC = () => {
  const { watchHistory, clearWatchHistory } = useStore();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Watch History</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <select className="bg-gray-800 text-white p-2 rounded">
            <option>Filter: All</option>
            {/* Add more filter options here */}
          </select>
          <select className="bg-gray-800 text-white p-2 rounded">
            <option>Sort: Recently Viewed</option>
            {/* Add more sort options here */}
          </select>
        </div>
        <button
          onClick={clearWatchHistory}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {watchHistory.length > 0 ? (
          watchHistory.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full">No watch history found yet.</p>
        )}
      </div>
    </div>
  );
};

export default WatchHistory; 