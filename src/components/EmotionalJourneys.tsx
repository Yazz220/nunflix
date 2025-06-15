import React from 'react';
import { Link } from 'react-router-dom';

const EmotionalJourneys: React.FC = () => {
  const placeholderData = [
    {
      id: 'tt0120689',
      title: 'The Green Mile',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_SX300.jpg',
    },
    {
      id: 'tt0109830',
      title: 'Forrest Gump',
      poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    },
    {
      id: 'tt0118799',
      title: 'Life Is Beautiful',
      poster: 'https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bebas text-white">Emotional Journeys</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholderData.map((item) => (
            <Link to={`/details/${item.id}`} key={item.id} className="group">
              <div className="relative">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <h3 className="text-primary-text mt-2">{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalJourneys;