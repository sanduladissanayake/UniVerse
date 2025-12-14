import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import { Calendar, MapPin, Users, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  club: {
    id: number;
    name: string;
    logoUrl?: string;
    description: string;
  };
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await eventAPI.getEventById(Number(id));
      setEvent(data);
      setError('');
    } catch (err) {
      setError('Failed to load event details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setDeleting(true);
      await eventAPI.deleteEvent(Number(id));
      alert('Event deleted successfully!');
      navigate('/events');
    } catch (err) {
      alert('Failed to delete event. Please try again.');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = event && new Date(event.eventDate) > new Date();
  const canManageEvent = user && (user.role === 'SUPER_ADMIN' || (user.role === 'CLUB_ADMIN' && event?.createdBy.id === user.id));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Event not found'}
        </div>
        <button
          onClick={() => navigate('/events')}
          className="mt-4 text-blue-600 hover:text-blue-700 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/events')}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Events
      </button>

      {/* Event status badge */}
      <div className="mb-4">
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
          isUpcoming 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isUpcoming ? '🎉 Upcoming Event' : '📅 Past Event'}
        </span>
      </div>

      {/* Event header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className={`h-3 ${isUpcoming ? 'bg-green-500' : 'bg-gray-400'}`} />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            
            {canManageEvent && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit event"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete event"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Event info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <div className="font-medium">{formatDate(event.eventDate)}</div>
                <div className="text-sm text-gray-600">{formatTime(event.eventDate)}</div>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-3 text-blue-600" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <Users className="w-5 h-5 mr-3 text-blue-600" />
              <Link 
                to={`/clubs/${event.club.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                Organized by <span className="font-medium">{event.club.name}</span>
              </Link>
            </div>
          </div>

          {/* Event description */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About this event</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      </div>

      {/* Club info card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Organized by</h2>
        
        <Link 
          to={`/clubs/${event.club.id}`}
          className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {event.club.logoUrl && (
            <img 
              src={event.club.logoUrl} 
              alt={event.club.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{event.club.name}</h3>
            <p className="text-gray-600 line-clamp-2">{event.club.description}</p>
          </div>

          <span className="text-blue-600 hover:text-blue-700">
            View Club →
          </span>
        </Link>
      </div>

      {/* Action buttons */}
      {isUpcoming && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Interested in this event?</h3>
          <p className="text-gray-700 mb-4">
            Join {event.club.name} to stay updated about this and future events!
          </p>
          <Link
            to={`/clubs/${event.club.id}`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Club
          </Link>
        </div>
      )}
    </div>
  );
};
