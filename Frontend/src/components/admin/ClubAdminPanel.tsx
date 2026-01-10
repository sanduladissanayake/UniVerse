import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import { eventAPI, clubAPI, fileAPI, announcementAPI } from '../../services/api';
import { Calendar, Plus, Users, Edit, Trash2, Upload, X, MapPin, Clock, Bell } from 'lucide-react';
import AnnouncementList from '../announcements/AnnouncementList';
// import { useNavigate } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  photoUrl?: string;
  createdAt?: string;
}

interface Club {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  adminId?: number;
  membershipFee?: number;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  clubId: number;
  createdBy: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const ClubAdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { success: showSuccess, error: showError, announcement: showAnnouncement } = useToastContext();
  // const navigate = useNavigate();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'members' | 'announcements'>('events');
  
  // Event form
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    photoUrl: '',
  });
  const [eventPhotoFile, setEventPhotoFile] = useState<File | null>(null);
  const [eventPhotoPreview, setEventPhotoPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Announcement form
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<number | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
  });
  const [announcementLoading, setAnnouncementLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all clubs and find the one managed by this admin
      const clubsResponse = await clubAPI.getAllClubs();
      const clubsList = Array.isArray(clubsResponse) ? clubsResponse : (clubsResponse.clubs || clubsResponse.data || []);
      const adminClub = clubsList.find((c: Club) => c.adminId === user?.id);
      
      if (!adminClub) {
        setError('You are not assigned to manage any club yet.');
        setLoading(false);
        return;
      }

      setClub(adminClub);

      // Fetch club events, members, and announcements
      const eventsResponse = await eventAPI.getEventsByClub(adminClub.id);
      const eventsList = Array.isArray(eventsResponse) ? eventsResponse : (eventsResponse.events || eventsResponse.data || []);
      
      const membersResponse = await clubAPI.getClubMembers(adminClub.id);
      const membersList = Array.isArray(membersResponse) ? membersResponse : (membersResponse.memberships || membersResponse.data || []);
      
      const announcementsResponse = await announcementAPI.getAllAnnouncementsByClub(adminClub.id);
      const announcementsList = Array.isArray(announcementsResponse) 
        ? announcementsResponse 
        : (announcementsResponse.announcements || announcementsResponse.data || []);
      
      setEvents(eventsList);
      setMembers(membersList);
      setAnnouncements(announcementsList);
      setError('');
    } catch (err) {
      setError('Failed to load data: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadEventPhoto = async (): Promise<string | null> => {
    if (!eventPhotoFile) return eventForm.photoUrl;

    try {
      setUploading(true);
      const response = await fileAPI.uploadImage(eventPhotoFile);
      if (response.success) {
        return response.filePath;
      } else {
        throw new Error(response.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload photo: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club || !user) return;

    try {
      let photoUrl = eventForm.photoUrl;
      if (eventPhotoFile) {
        const uploadedUrl = await uploadEventPhoto();
        if (!uploadedUrl) return;
        photoUrl = uploadedUrl;
      }

      // Combine date and time
      const eventDateTime = `${eventForm.eventDate}T${eventForm.eventTime}`;

      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        eventDate: eventDateTime,
        location: eventForm.location,
        photoUrl: photoUrl,
        clubId: club.id,
        createdBy: user.id,
      };

      if (editingEventId) {
        // Update existing event
        await eventAPI.updateEvent(editingEventId, eventData);
        setSuccess('Event updated successfully!');
        setEditingEventId(null);
      } else {
        // Create new event
        await eventAPI.createEvent(eventData);
        setSuccess('Event created successfully!');
      }
      
      resetEventForm();
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to save event: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventAPI.deleteEvent(eventId);
      setSuccess('Event deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to delete event: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleEditEvent = (event: Event) => {
    const [dateStr, timeStr] = event.eventDate.split('T');
    const timeOnly = timeStr?.substring(0, 5) || '00:00';
    
    setEventForm({
      title: event.title,
      description: event.description,
      eventDate: dateStr,
      eventTime: timeOnly,
      location: event.location,
      photoUrl: event.photoUrl || '',
    });
    setEditingEventId(event.id);
    setShowEventForm(true);
  };

  const resetEventForm = () => {
    setEventForm({ title: '', description: '', eventDate: '', eventTime: '', location: '', photoUrl: '' });
    setEventPhotoFile(null);
    setEventPhotoPreview('');
    setShowEventForm(false);
    setEditingEventId(null);
  };

  // Announcement handlers
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club || !user) return;

    try {
      setAnnouncementLoading(true);
      const announcementData = {
        title: announcementForm.title,
        content: announcementForm.content,
        clubId: club.id,
        createdBy: user.id,
      };

      if (editingAnnouncementId) {
        // Update existing announcement
        await announcementAPI.updateAnnouncement(editingAnnouncementId, announcementData);
        showSuccess('Announcement updated successfully!', 'Update Successful');
        setEditingAnnouncementId(null);
      } else {
        // Create new announcement
        await announcementAPI.createAnnouncement(announcementData);
        showSuccess('Announcement created as draft. Publish it to make it visible to members.', 'Announcement Created');
      }

      resetAnnouncementForm();
      fetchData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showError(errorMsg, 'Failed to Save Announcement');
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handlePublishAnnouncement = async (announcementId: number) => {
    try {
      setAnnouncementLoading(true);
      await announcementAPI.publishAnnouncement(announcementId);
      showAnnouncement('Announcement is now visible to all club members!', 'Announcement Published');
      fetchData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showError(errorMsg, 'Failed to Publish');
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleUnpublishAnnouncement = async (announcementId: number) => {
    try {
      setAnnouncementLoading(true);
      await announcementAPI.unpublishAnnouncement(announcementId);
      showSuccess('Announcement is now hidden from members.', 'Unpublished');
      fetchData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showError(errorMsg, 'Failed to Unpublish');
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: number) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      setAnnouncementLoading(true);
      await announcementAPI.deleteAnnouncement(announcementId);
      showSuccess('Announcement has been permanently deleted.', 'Deleted');
      fetchData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showError(errorMsg, 'Failed to Delete');
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
    });
    setEditingAnnouncementId(announcement.id);
    setShowAnnouncementForm(true);
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({ title: '', content: '' });
    setShowAnnouncementForm(false);
    setEditingAnnouncementId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          {error || 'You are not assigned to manage any club yet. Please contact the super admin.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          {club.logoUrl && (
            <img src={club.logoUrl} alt={club.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
          )}
          {club.name} - Admin Panel
        </h1>
        <p className="text-gray-600">Manage your club's events and members</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          {error}
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          {success}
          <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <Calendar className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold mb-1">{events.length}</div>
          <div className="text-blue-100">Total Events</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <Users className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold mb-1">{members.length}</div>
          <div className="text-green-100">Club Members</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <Bell className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold mb-1">{announcements.length}</div>
          <div className="text-purple-100">Announcements</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'events'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'announcements'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="w-5 h-5 inline mr-2" />
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'members'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Members
          </button>
        </div>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Club Events</h2>
            <button
              onClick={() => setShowEventForm(!showEventForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </button>
          </div>

          {/* Create Event Form */}
          {showEventForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold mb-4">
                {editingEventId ? 'Edit Event' : 'Create New Event'}
              </h3>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                {/* Photo Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {eventPhotoPreview ? (
                    <div className="relative inline-block w-full">
                      <img
                        src={eventPhotoPreview}
                        alt="Event photo preview"
                        className="h-48 w-full object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEventPhotoFile(null);
                          setEventPhotoPreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center cursor-pointer py-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium">Click to upload event photo</p>
                      <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEventPhotoChange}
                    className="hidden"
                    id="event-photo-input"
                  />
                  <label htmlFor="event-photo-input" className="block mt-2 cursor-pointer">
                    <div className="text-center text-sm text-gray-600">
                      {eventPhotoFile ? `Selected: ${eventPhotoFile.name}` : 'Choose image or drag'}
                    </div>
                  </label>
                </div>

                {/* Event Title */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Event Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Annual Sports Day"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Event Description */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description *</label>
                  <textarea
                    placeholder="Provide detailed information about the event"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Date *</label>
                    <input
                      type="date"
                      value={eventForm.eventDate}
                      onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Time *</label>
                    <input
                      type="time"
                      value={eventForm.eventTime}
                      onChange={(e) => setEventForm({ ...eventForm, eventTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Venue/Location */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Venue/Location *</label>
                  <input
                    type="text"
                    placeholder="e.g., Main Auditorium, Building A"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                  >
                    {uploading ? 'Uploading...' : (editingEventId ? 'Update Event' : 'Create Event')}
                  </button>
                  <button
                    type="button"
                    onClick={resetEventForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No events yet. Create your first event!</p>
                <button
                  onClick={() => setShowEventForm(!showEventForm)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Event
                </button>
              </div>
            ) : (
              events.map((event) => {
                const [eventDateStr, eventTimeStr] = event.eventDate.split('T');
                const eventTimeOnly = eventTimeStr?.substring(0, 5) || '00:00';
                const eventDate = new Date(eventDateStr);
                const isUpcoming = new Date(event.eventDate) > new Date();
                
                return (
                  <div 
                    key={event.id} 
                    className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${
                      isUpcoming ? 'border-l-green-500' : 'border-l-gray-400'
                    }`}
                  >
                    <div className="flex gap-4">
                      {event.photoUrl && (
                        <img
                          src={event.photoUrl}
                          alt={event.title}
                          className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                              {isUpcoming && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  Upcoming
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{event.description}</p>

                        {/* Event Details */}
                        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>
                              {eventDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{eventTimeOnly}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Club Announcements</h2>
            <button
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Announcement
            </button>
          </div>

          {/* Create Announcement Form */}
          {showAnnouncementForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold mb-4">
                {editingAnnouncementId ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Important Event Update"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Content *</label>
                  <textarea
                    placeholder="Enter announcement content..."
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={announcementLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                  >
                    {announcementLoading ? 'Saving...' : (editingAnnouncementId ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={resetAnnouncementForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Announcements List */}
          <div>
            {announcements.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No announcements yet. Create your first announcement!</p>
                <button
                  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Announcement
                </button>
              </div>
            ) : (
              <AnnouncementList
                announcements={announcements}
                onEdit={handleEditAnnouncement}
                onDelete={handleDeleteAnnouncement}
                onPublish={handlePublishAnnouncement}
                onUnpublish={handleUnpublishAnnouncement}
                isAdmin={true}
                isLoading={announcementLoading}
              />
            )}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Club Members</h2>
          {members.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No members yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{member.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(member.joinedAt || new Date().toISOString())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
