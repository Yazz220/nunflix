import React from 'react';
import { Link } from 'react-router-dom';

const ContinueWatchingCarousel: React.FC = () => {
  const placeholderData = [
    {
      id: 'tt0111161',
      title: 'The Shawshank Redemption',
      poster: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      progress: 50,
    },
    {
      id: 'tt0068646',
      title: 'The Godfather',
      poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      progress: 25,
    },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bebas text-white">Continue Watching</h2>
          <button className="text-secondary-text hover:text-white transition-colors">
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {placeholderData.map((item) => (
            <Link to={`/player/${item.id}`} key={item.id} className="group">
              <div className="relative">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <h3 className="text-primary-text mt-2">{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingCarousel;