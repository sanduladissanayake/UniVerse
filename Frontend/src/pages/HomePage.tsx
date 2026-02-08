import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { EventCard } from '../components/EventCard';
import { eventAPI, clubAPI } from '../services/api';


interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  photoUrl?: string;
  clubId?: number;
  createdBy?: number;
}

interface Club {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  adminId?: number;
  membershipFee?: number;
}

export function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchClubs()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await clubAPI.getAllClubs();
      const clubsList = Array.isArray(response)
        ? response
        : (response.clubs || response.data || []);
      setClubs(clubsList);
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllEvents();
      const eventsList = Array.isArray(response) 
        ? response 
        : (response.events || response.data || []);
      
      // Filter for upcoming events only (events with date in the future)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingEvents = eventsList.filter((event: Event) => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= today;
      });
      
      setEvents(upcomingEvents);
      setError('');
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .scroll-animation {
          animation: scrollLeft 35s linear infinite;
        }
        .wave-divider {
          position: relative;
          height: 100px;
        }
        .wave-divider svg {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .clubs-carousel {
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, #f0f9fb 0%, #f5fdfb 100%);
          border-radius: 20px;
          border: 1px solid #e0f2f1;
          padding: 3rem 0;
        }
        .clubs-carousel-track {
          display: flex;
          gap: 3rem;
          width: fit-content;
        }
        .float-animation {
          animation: float 5s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #00897b, #0097a7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 to-teal-500 text-white overflow-hidden pt-20 pb-40">
        <div className="container mx-auto px-6">
<div className="grid grid-cols-1 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-teal-100 text-sm font-semibold tracking-widest uppercase">
                University Club Management Platform
              </p>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                  Welcome to{' '}
                  <span className="text-yellow-300">UniVerse</span>
                </h1>
              </div>
              <p className="text-lg text-teal-50 leading-relaxed">
                Connect with vibrant clubs, discover amazing events, and create unforgettable memories with our university community platform
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to="/events"
                  className="px-8 py-3 bg-yellow-400 text-teal-900 font-bold rounded-full hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg hover:scale-105 float-animation"
                >
                  Explore Events →
                </Link>
                <Link 
                  to="/clubs"
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full border-2 border-white hover:bg-white/30 transition-all duration-300"
                >
                  Browse Clubs →
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 wave-divider">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="white" fillOpacity="1" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,48C960,32,1056,16,1152,21.3C1248,27,1344,43,1392,50.7L1440,58L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Clubs Carousel Section */}
      {clubs.length > 0 && (
        <section className="relative py-20 px-6 bg-white">
          <div className="container mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-gray-900 mb-4">
                Featured <span className="gradient-text">Clubs</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore the amazing clubs that make our university community special
              </p>
            </div>

            {/* Carousel */}
            <div className="clubs-carousel">
              <div className="clubs-carousel-track scroll-animation">
                {/* Original clubs */}
                {clubs.map((club) => (
                  <div
                    key={`original-${club.id}`}
                    className="flex-shrink-0 flex flex-col items-center justify-center group cursor-pointer"
                  >
                    {club.logoUrl ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                        <img
                          src={club.logoUrl}
                          alt={club.name}
                          className="h-40 w-40 object-contain relative rounded-2xl group-hover:scale-110 transition-transform duration-300"
                          title={club.name}
                        />
                      </div>
                    ) : (
                      <div className="h-40 w-40 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-900 font-bold text-center px-4 border-2 border-teal-200 group-hover:border-teal-400 transition-all duration-300 group-hover:scale-110">
                        {club.name}
                      </div>
                    )}
                    <p className="mt-4 text-center font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 max-w-xs">{club.name}</p>
                  </div>
                ))}
                {/* Duplicate clubs for seamless loop */}
                {clubs.map((club) => (
                  <div
                    key={`duplicate-${club.id}`}
                    className="flex-shrink-0 flex flex-col items-center justify-center group cursor-pointer"
                  >
                    {club.logoUrl ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                        <img
                          src={club.logoUrl}
                          alt={club.name}
                          className="h-40 w-40 object-contain relative rounded-2xl group-hover:scale-110 transition-transform duration-300"
                          title={club.name}
                        />
                      </div>
                    ) : (
                      <div className="h-40 w-40 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-900 font-bold text-center px-4 border-2 border-teal-200 group-hover:border-teal-400 transition-all duration-300 group-hover:scale-110">
                        {club.name}
                      </div>
                    )}
                    <p className="mt-4 text-center font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 max-w-xs">{club.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-sky-100 to-white">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Don't miss out on these exciting events happening in the UniVerse community
            </p>
          </div>

          {/* Events Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="space-y-4 text-center">
                <div className="inline-block">
                  <div className="w-16 h-16 border-4 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
                </div>
                <div className="text-gray-600 text-xl font-light">Loading amazing events...</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="bg-red-50 p-8 rounded-2xl text-center border-2 border-red-200">
                <div className="text-red-600 text-xl font-semibold">{error}</div>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="bg-teal-50 p-8 rounded-2xl text-center border-2 border-teal-200">
                <div className="text-teal-700 text-xl font-light">No events available at the moment</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="group">
                  <EventCard
                    id={event.id.toString()}
                    title={event.title}
                    date={formatDate(event.eventDate)}
                    location={event.location}
                    attendees={0}
                    category={event.description?.split('\n')[0] || 'Event'}
                    image={event.photoUrl || 'https://images.unsplash.com/photo-1540575467063-178f50202fe4?w=800&q=80'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl p-12 md:p-20 text-center max-w-4xl mx-auto border-2 border-teal-200">
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Ready to Join the <span className="gradient-text">Community?</span>
            </h3>
            <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto font-light">
              Connect with like-minded students, participate in incredible events, and make lasting memories
            </p>
            <Link 
              to="/clubs"
              className="inline-block px-12 py-4 bg-yellow-400 text-teal-900 font-bold rounded-full hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg hover:scale-105 text-lg"
            >
              Explore All Clubs →
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}