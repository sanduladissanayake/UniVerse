import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
  image: string;
}

export function EventCard({ 
  id, 
  title, 
  date, 
  location, 
  attendees, 
  category, 
  image 
}: EventCardProps) {
  return (
    <Link to={`/events/${id}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <span className="absolute top-4 right-4 px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-sm rounded-full">
            {category}
          </span>
        </div>
        
        <div className="p-6 space-y-4">
          <h3 className="text-white text-xl font-semibold group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{date}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/60">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/60">
              <Users className="w-4 h-4" />
              <span className="text-sm">{attendees} attendees</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}