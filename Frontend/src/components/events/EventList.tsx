import React, { useState, useEffect } from 'react';
import { EventCard } from './EventCard';
import { eventAPI } from '../../services/api';
import { Search, Calendar, Filter } from 'lucide-react';

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
  };
}

export const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filterType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllEvents();
      console.log('Events API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Is Array?', Array.isArray(response));
      
      // Handle different response formats
      if (Array.isArray(response)) {
        console.log('Setting events from array:', response.length);
        setEvents(response);
      } else if (response && Array.isArray(response.events)) {
        console.log('Setting events from response.events:', response.events.length);
        setEvents(response.events);
      } else if (response && response.success && Array.isArray(response.data)) {
        console.log('Setting events from response.data:', response.data.length);
        setEvents(response.data);
      } else {
        console.log('Unknown response format, setting empty array');
        console.log('Response keys:', response ? Object.keys(response) : 'null');
        setEvents([]);
        setError('Events loaded but in unexpected format. Check console.');
      }
    } catch (err: any) {
      setError('Failed to load events: ' + (err.message || 'Unknown error'));
      console.error('Events fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.club.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by time
    const now = new Date();
    if (filterType === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.eventDate) > now);
    } else if (filterType === 'past') {
      filtered = filtered.filter(event => new Date(event.eventDate) <= now);
    }

    // Sort by date (upcoming first, then by closest date)
    filtered.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      return dateA.getTime() - dateB.getTime();
    });

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900/20 to-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            University Events
          </h1>
          <p className="text-xl text-white/90 mb-8">Discover and join upcoming events organized by clubs</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Buttons */}
        <div className="mb-8 flex justify-center gap-3">

          <button
            onClick={() => setFilterType('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              filterType === 'all'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilterType('upcoming')}
            className={`px-6 py-3 rounded-full font-medium transition-all flex items-center ${
              filterType === 'upcoming'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming
          </button>
          <button
            onClick={() => setFilterType('past')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              filterType === 'past'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            Past
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No events found</h3>
            <p className="text-white/60">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'No events are available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Event count */}
        <div className="mt-12 text-center text-white/60 text-lg">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>
    </div>
  );
};
