import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    club: {
      id: number;
      name: string;
      logoUrl?: string;
    };
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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

  const isUpcoming = new Date(event.eventDate) > new Date();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-2 ${isUpcoming ? 'bg-green-500' : 'bg-gray-400'}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Link 
              to={`/events/${event.id}`}
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {event.title}
            </Link>
            {event.club && (
              <Link 
                to={`/clubs/${event.club.id}`}
                className="text-sm text-gray-600 hover:text-blue-600 flex items-center mt-1"
              >
                <Users className="w-4 h-4 mr-1" />
                {event.club.name}
              </Link>
            )}
          </div>
          
          {event.club?.logoUrl && (
            <img 
              src={event.club.logoUrl} 
              alt={event.club.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {formatDate(event.eventDate)} at {formatTime(event.eventDate)}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xs px-3 py-1 rounded-full ${
            isUpcoming 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isUpcoming ? 'Upcoming' : 'Past Event'}
          </span>

          <Link
            to={`/events/${event.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
