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

  const handleJoinClub = async (clubId: number) => {
    if (!user) {
      alert('Please login to join a club');
      return;
    }

    try {
      const response = await membershipAPI.joinClub(user.id, clubId);
      if (response.success) {
        setJoinedClubs([...joinedClubs, clubId]);
        alert('Successfully joined the club!');
      }
    } catch (err) {
      alert('Failed to join club');
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">University Clubs</h1>
        <p className="text-gray-600 mb-6">Discover and join clubs that match your interests</p>
        
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {filteredClubs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No clubs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => (
            <ClubCard
              key={club.id}
              club={club}
              onJoin={handleJoinClub}
              isJoined={joinedClubs.includes(club.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
