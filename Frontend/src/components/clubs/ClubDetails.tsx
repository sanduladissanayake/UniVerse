import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clubAPI, eventAPI, membershipAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Club {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  adminId: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
}

export const ClubDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClubDetails();
      fetchClubEvents();
      checkMembership();
    }
  }, [id, user]);

  const fetchClubDetails = async () => {
    try {
      const response = await clubAPI.getClubById(Number(id));
      if (response.success) {
        setClub(response.club);
      }
    } catch (err) {
      console.error('Failed to fetch club details');
    } finally {
      setLoading(false);
    }
  };

  const fetchClubEvents = async () => {
    try {
      const response = await eventAPI.getEventsByClub(Number(id));
      if (response.success) {
        setEvents(response.events);
      }
    } catch (err) {
      console.error('Failed to fetch events');
    }
  };

  const checkMembership = async () => {
    if (!user) return;
    try {
      const response = await membershipAPI.getUserMemberships(user.id);
      if (response.success) {
        const joined = response.memberships.some((m: any) => m.clubId === Number(id));
        setIsJoined(joined);
      }
    } catch (err) {
      console.error('Failed to check membership');
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await membershipAPI.joinClub(user.id, Number(id));
      if (response.success) {
        setIsJoined(true);
        alert('Successfully joined the club!');
      }
    } catch (err) {
      alert('Failed to join club');
    }
  };

  const handleLeave = async () => {
    if (!user) return;

    if (confirm('Are you sure you want to leave this club?')) {
      try {
        const response = await membershipAPI.leaveClub(user.id, Number(id));
        if (response.success) {
          setIsJoined(false);
          alert('You have left the club');
        }
      } catch (err) {
        alert('Failed to leave club');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Club not found</h2>
        <button
          onClick={() => navigate('/clubs')}
          className="mt-4 text-purple-600 hover:text-purple-700"
        >
          Back to Clubs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Club Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            {club.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={club.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-4xl font-bold">
                {club.name.charAt(0)}
              </div>
            )}

            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{club.name}</h1>
              <p className="text-gray-600 text-lg">{club.description}</p>
            </div>
          </div>

          <div>
            {user && (
              isJoined ? (
                <button
                  onClick={handleLeave}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Leave Club
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                >
                  Join Club
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Club Events */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
        
        {events.length === 0 ? (
          <p className="text-gray-600">No upcoming events</p>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                <p className="text-gray-600 mt-2">{event.description}</p>
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                  <span>📍 {event.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
