import React from 'react';

interface PersonCardProps {
  name: string;
  role: string;
  profilePath: string | null;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, role, profilePath }) => {
  const imageUrl = profilePath
    ? `https://image.tmdb.org/t/p/w185${profilePath}`
    : '/placeholder-person.jpg'; // Use the actual placeholder image path

  return (
    <div className="flex flex-col items-center text-center w-24 flex-shrink-0">
      <img
        src={imageUrl}
        alt={name}
        className="w-20 h-20 object-cover rounded-full mb-2 border-2 border-gray-700"
      />
      <p className="text-sm font-semibold text-white truncate w-full">{name}</p>
      <p className="text-xs text-gray-400 truncate w-full">{role}</p>
    </div>
  );
};

export default PersonCard; 