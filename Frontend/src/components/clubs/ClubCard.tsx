import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Club {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  adminId: number;
}

interface ClubCardProps {
  club: Club;
  onJoin?: (clubId: number) => void;
  isJoined?: boolean;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, onJoin, isJoined }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/clubs/${club.id}`);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onJoin) {
      onJoin(club.id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {club.logoUrl ? (
            <img
              src={club.logoUrl}
              alt={club.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
              {club.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{club.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{club.description}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleViewDetails}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View Details →
            </button>

            {onJoin && (
              <button
                onClick={handleJoin}
                disabled={isJoined}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  isJoined
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                }`}
              >
                {isJoined ? 'Joined' : 'Join Club'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
