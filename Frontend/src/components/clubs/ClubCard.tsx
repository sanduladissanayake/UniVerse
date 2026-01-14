import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MembershipForm } from './MembershipForm';

interface Club {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  adminId: number;
  membershipFee?: number;
}

interface ClubCardProps {
  club: Club;
  isJoined?: boolean;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, isJoined }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isMembershipOpen, setIsMembershipOpen] = useState(false);

  const handleViewDetails = () => {
    navigate(`/clubs/${club.id}`);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setIsMembershipOpen(true);
  };

  return (
    <>
      <div
        className="bg-teal-50 border-2 border-teal-200 rounded-lg shadow-md hover:shadow-xl hover:border-teal-400 transition-all p-6 cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {club.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={club.name}
                className="w-16 h-16 rounded-lg object-cover border border-teal-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                {club.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {club.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {club.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleViewDetails}
                className="text-black hover:text-yellow-600 font-bold text-sm"
              >
                View Details →
              </button>

              <button
                onClick={handleJoin}
                disabled={isJoined}
                className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                  isJoined
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow-400 text-black hover:bg-yellow-300'
                }`}
              >
                {isJoined ? 'Joined' : 'Join Club'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Form Modal */}
      <MembershipForm
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
        clubId={club.id}
        clubName={club.name}
        membershipFee={club.membershipFee ? Number(club.membershipFee) : 0}
        onSuccess={() => {
          setIsMembershipOpen(false);
        }}
      />
    </>
  );
};
