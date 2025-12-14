import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';

const recentEvents = [
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

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1646696097522-aceb739108ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwbmlnaHR8ZW58MXx8fHwxNzYzMTg2MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="University campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-blue-900/30 animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pt-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  UniVerse
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
                Connect, collaborate, and create unforgettable experiences with university clubs and events
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Link 
                to="/events"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-500 hover:to-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
              >
                Explore Events
              </Link>
              <Link 
                to="/clubs"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Join Clubs
              </Link>
            </div>
          </div>
          
          {/* Recent Events Section */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Upcoming Events
              </h2>
              <p className="text-white/60 text-lg">
                Discover what's happening in the UniVerse community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {recentEvents.map((event) => (
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
          </div>
        </div>
        
        {/* Bottom fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>
    </div>
  );
}