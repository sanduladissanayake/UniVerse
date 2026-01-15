import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import { clubAPI, membershipAPI, announcementAPI } from '../services/api';
import { Bell, Search, Filter, RefreshCw } from 'lucide-react';
import AnnouncementList from '../components/announcements/AnnouncementList';

interface Club {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  clubId: number;
  createdBy: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export function AnnouncementsPage() {
  const { user } = useAuth();
  const { announcement: showAnnouncement, error: showError } = useToastContext();
  const [announcements, setAnnouncements] = useState<(Announcement & { club?: Club })[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!user?.id) {
        setError('Please log in to view announcements');
        setLoading(false);
        return;
      }

      // Fetch all clubs
      const clubsResponse = await clubAPI.getAllClubs();
      const clubsList = Array.isArray(clubsResponse) 
        ? clubsResponse 
        : (clubsResponse.clubs || clubsResponse.data || []);

      if (!Array.isArray(clubsList) || clubsList.length === 0) {
        setError('No clubs found');
        setLoading(false);
        return;
      }

      // Fetch user's club memberships
      const membershipsResponse = await membershipAPI.getUserMemberships(user.id);
      
      // Handle different response structures
      let membershipsList: any[] = [];
      if (Array.isArray(membershipsResponse)) {
        membershipsList = membershipsResponse;
      } else if (membershipsResponse?.memberships) {
        membershipsList = Array.isArray(membershipsResponse.memberships) 
          ? membershipsResponse.memberships 
          : [membershipsResponse.memberships];
      } else if (membershipsResponse?.data) {
        membershipsList = Array.isArray(membershipsResponse.data) 
          ? membershipsResponse.data 
          : [membershipsResponse.data];
      }

      // Get the clubs the user is a member of (handle both clubId and club_id)
      const userClubIds = membershipsList.map((m: any) => m.clubId || m.club_id);
      const userClubs = clubsList.filter((c: Club) => userClubIds.includes(c.id));
      
      setJoinedClubs(userClubs);

      if (userClubs.length === 0) {
        setError('You are not a member of any clubs yet');
        setLoading(false);
        return;
      }

      // Fetch announcements from all user's clubs
      const allAnnouncements: (Announcement & { club?: Club })[] = [];
      let hasErrors = false;

      for (const club of userClubs) {
        try {
          const announcementsResponse = await announcementAPI.getPublishedAnnouncementsByClub(club.id);
          
          // Handle different response structures
          let clubAnnouncements: Announcement[] = [];
          if (Array.isArray(announcementsResponse)) {
            clubAnnouncements = announcementsResponse;
          } else if (announcementsResponse?.announcements) {
            clubAnnouncements = Array.isArray(announcementsResponse.announcements)
              ? announcementsResponse.announcements
              : [announcementsResponse.announcements];
          } else if (announcementsResponse?.data) {
            clubAnnouncements = Array.isArray(announcementsResponse.data)
              ? announcementsResponse.data
              : [announcementsResponse.data];
          }

          // Add club info to each announcement
          clubAnnouncements.forEach((ann: Announcement) => {
            if (ann && ann.id && ann.isPublished) {
              allAnnouncements.push({
                ...ann,
                club: club,
              });
            }
          });
        } catch (err) {
          console.error(`Failed to fetch announcements for club ${club.id}:`, err);
          hasErrors = true;
        }
      }

      // Sort by created date (newest first)
      allAnnouncements.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAnnouncements(allAnnouncements);

      if (allAnnouncements.length > 0) {
        showAnnouncement(`Found ${allAnnouncements.length} announcement${allAnnouncements.length !== 1 ? 's' : ''}`, 'New Announcements');
      }

      if (hasErrors) {
        showError('Some announcements could not be loaded', 'Partial Load');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to load announcements: ' + errorMsg);
      showError(errorMsg, 'Error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClub = selectedClubId === null || announcement.club?.id === selectedClubId;
    
    return matchesSearch && matchesClub;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (joinedClubs.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay updated with the latest news from your clubs
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 text-center">
            <Bell className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <p className="text-gray-700 mb-4 font-semibold">You haven't joined any clubs yet.</p>
            <a 
              href="/clubs" 
              className="inline-block bg-yellow-400 text-teal-900 px-6 py-2 rounded-full hover:bg-yellow-300 transition font-bold"
            >
              Browse Clubs
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-12 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              <span className="text-teal-600">Announcements</span>
            </h1>
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="p-2 hover:bg-teal-100 rounded-full transition disabled:opacity-50"
              title="Refresh announcements"
            >
              <RefreshCw className={`w-6 h-6 text-teal-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news from your clubs
          </p>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-semibold">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white text-gray-900"
            />
          </div>

          {/* Club Filter */}
          {joinedClubs.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-600" />
              <button
                onClick={() => setSelectedClubId(null)}
                className={`px-4 py-2 rounded-lg transition font-semibold ${
                  selectedClubId === null
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Clubs
              </button>
              {joinedClubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClubId(club.id)}
                  className={`px-4 py-2 rounded-lg transition font-semibold ${
                    selectedClubId === club.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {club.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Announcements List or Empty State */}
        <div className="max-w-4xl mx-auto">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                {searchQuery ? 'No announcements match your search.' : 'No announcements yet from your clubs.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.club?.logoUrl && (
                          <img 
                            src={announcement.club.logoUrl} 
                            alt={announcement.club.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm font-bold text-teal-600">{announcement.club?.name}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-3 whitespace-pre-wrap">{announcement.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}