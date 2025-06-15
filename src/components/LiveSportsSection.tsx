import type React from 'react';
const LiveSportsSection: React.FC = () => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bebas text-white">Live Sports</h2>
          <button className="text-secondary-text hover:text-white transition-colors">
            Show All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* Placeholder Content */}
          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                <span className="text-red-400 text-sm font-semibold">LIVE</span>
              </div>
              <span className="text-gray-400 text-sm">10:00 PM</span>
            </div>
            <h3 className="text-white font-semibold mb-1 leading-tight">
              Live sports coming soon
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm capitalize">
                Various Sports
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSportsSection;
