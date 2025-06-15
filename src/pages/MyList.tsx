import React from 'react';
import useStore from '../store/useStore';
import ContentCard from '../components/ContentCard';

const MyList: React.FC = () => {
  const { myList, clearMyList } = useStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My List</h1>
        <button
          onClick={clearMyList}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Clear All
        </button>
      </div>

      {myList.length === 0 ? (
        <p className="text-gray-400 text-center text-lg mt-10">Your list is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {myList.map((content) => (
            <ContentCard key={content.id} content={content} size="small" />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList; 