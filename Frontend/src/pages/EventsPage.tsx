import { useState } from 'react';
import { EventCard } from '../components/EventCard';
import { Search, Filter } from 'lucide-react';

const sampleEvents = [
  {
    id: '1',
    title: 'Tech Workshop 2024',
    date: 'December 15, 2025',
    location: 'Computer Lab A',
    attendees: 45,
    category: 'Technical',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80',
  },
  {
    id: '2',
    title: 'Beach Cleanup',
    date: 'December 18, 2025',
    location: 'Galle Face Beach',
    attendees: 150,
    category: 'Environmental',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80',
  },
  {
    id: '3',
    title: 'Munch Mania',
    date: 'December 28, 2025',
    location: 'Food Court Area',
    attendees: 420,
    category: 'Food Festival',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  },
  {
    id: '4',
    title: 'Leads Summit',
    date: 'January 15, 2026',
    location: 'Conference Hall',
    attendees: 280,
    category: 'Leadership',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
  },
];

export function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Technical', 'Environmental', 'Food Festival', 'Leadership', 'Cultural', 'Sports'];

  const filteredEvents = sampleEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Upcoming Events
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Discover exciting events happening across our university community
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 appearance-none min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All' ? '' : category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
              category={event.category}
              image={event.image}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center text-white/60 mt-16">
            <p className="text-xl">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}