import React, { useState, useEffect } from 'react';
import { ClubCard } from './ClubCard';
import { clubAPI, membershipAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Club {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  adminId: number;
  membershipFee?: number;
}

export const ClubList: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinedClubs, setJoinedClubs] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchClubs();
    if (user) {
      fetchUserMemberships();
    }
  }, [user]);

  const fetchClubs = async () => {
    try {
      const response = await clubAPI.getAllClubs();
      if (response.success) {
        setClubs(response.clubs);
      }
    } catch (err) {
      setError('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMemberships = async () => {
    if (!user) return;
    try {
      const response = await membershipAPI.getUserMemberships(user.id);
      if (response.success) {
        const clubIds = response.memberships.map((m: any) => m.clubId);
        setJoinedClubs(clubIds);
      }
    } catch (err) {
      console.error('Failed to fetch memberships');
    }
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-teal-500 py-20">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            University <span className="text-yellow-300">Clubs</span>
          </h1>
          <p className="text-xl text-teal-50 mb-8">Discover and join clubs that match your interests</p>
          
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-2 focus:border-teal-600 shadow-lg font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 font-semibold">
            {error}
          </div>
        )}

        {filteredClubs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl font-semibold">No clubs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map(club => (
              <ClubCard
                key={club.id}
                club={club}
                isJoined={joinedClubs.includes(club.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
