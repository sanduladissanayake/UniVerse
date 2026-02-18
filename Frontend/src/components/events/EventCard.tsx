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
    photoUrl?: string;
    clubId?: number;
    club?: {
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

  const isUpcoming = event.eventDate ? new Date(event.eventDate) > new Date() : false;
  const clubId = event.club?.id || event.clubId;
  const clubName = event.club?.name || 'Club';

  return (
    <div className="bg-teal-50 border-2 border-teal-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:border-teal-400 transition-all">
      <div className={`h-2 ${isUpcoming ? 'bg-green-500' : 'bg-gray-400'}`} />
      
      {/* Event Photo Banner */}
      {event.photoUrl && (
        <div className="h-32 overflow-hidden bg-gray-200">
          <img 
            src={event.photoUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
          <Link 
              to={`/events/${event.id}`}
              className="text-xl font-semibold text-gray-900 hover:text-teal-600 transition-colors"
            >
              {event.title}
            </Link>
            {clubId && (
              <Link 
                to={`/clubs/${clubId}`}
                className="text-sm text-gray-600 hover:text-teal-600 flex items-center mt-1"
              >
                <Users className="w-4 h-4 mr-1" />
                <span>Organized by: <span className="font-medium">{clubName}</span></span>
              </Link>
            )}
          </div>
          
          {/* {event.club?.logoUrl && (
            <img 
              src={event.club.logoUrl} 
              alt={clubName}
              className="w-12 h-12 rounded-full object-cover"
            />
          )} */}
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
            {event.eventDate && (isUpcoming ? 'Upcoming' : 'Past Event')}
          </span>

          <Link
            to={`/events/${event.id}`}
            className="text- hover:text-yellow-600 text-sm font-bold"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
