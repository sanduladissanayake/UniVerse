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
  clubId?: number;
  club?: {
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
      
      // Handle different response formats from API
      let eventsList = [];
      if (Array.isArray(response)) {
        eventsList = response;
      } else if (response && response.success && Array.isArray(response.events)) {
        eventsList = response.events;
      } else if (response && Array.isArray(response.events)) {
        eventsList = response.events;
      } else if (response && Array.isArray(response.data)) {
        eventsList = response.data;
      }
      
      setEvents(eventsList);
      setError('');
    } catch (err: any) {
      setError('Failed to load events: ' + (err.message || 'Unknown error'));
      console.error('Events fetch error:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event => {
        const titleMatch = event.title.toLowerCase().includes(searchLower);
        const descMatch = event.description.toLowerCase().includes(searchLower);
        const clubMatch = event.club?.name?.toLowerCase().includes(searchLower) || false;
        return titleMatch || descMatch || clubMatch;
      });
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-teal-500 py-20">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            University <span className="text-yellow-300">Events</span>
          </h1>
          <p className="text-xl text-teal-50 mb-8">Discover and join upcoming events organized by clubs</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-2 focus:border-teal-600 shadow-lg font-semibold"
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
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              filterType === 'all'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilterType('upcoming')}
            className={`px-6 py-3 rounded-full font-bold transition-all flex items-center ${
              filterType === 'upcoming'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming
          </button>
          <button
            onClick={() => setFilterType('past')}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              filterType === 'past'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Past
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 font-semibold">
            {error}
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
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
        <div className="mt-12 text-center text-gray-600 text-lg font-semibold">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>
    </div>
  );
};
