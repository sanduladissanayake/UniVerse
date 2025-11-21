// API Configuration - Simple Fetch Implementation
const API_BASE_URL = 'http://localhost:8081/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// =========================
// AUTHENTICATION API
// =========================
export const authAPI = {
  // Register a new user
  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Get current user
  getCurrentUser: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// =========================
// CLUB API
// =========================
export const clubAPI = {
  // Get all clubs
  getAllClubs: async () => {
    const response = await fetch(`${API_BASE_URL}/clubs`);
    return response.json();
  },

  // Get club by ID
  getClubById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/clubs/${id}`);
    return response.json();
  },

  // Get club events
  getClubEvents: async (clubId: number) => {
    const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/events`);
    return response.json();
  },

  // Get club members
  getClubMembers: async (clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/club/${clubId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Create a club (Admin only)
  createClub: async (clubData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/clubs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(clubData),
    });
    return response.json();
  },

  // Update club (Admin only)
  updateClub: async (id: number, clubData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/clubs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(clubData),
    });
    return response.json();
  },

  // Delete club (Admin only)
  deleteClub: async (id: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/clubs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// =========================
// EVENT API
// =========================
export const eventAPI = {
  // Get all events
  getAllEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/events`);
    return response.json();
  },

  // Get event by ID
  getEventById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return response.json();
  },

  // Get events by club
  getEventsByClub: async (clubId: number) => {
    const response = await fetch(`${API_BASE_URL}/events/club/${clubId}`);
    return response.json();
  },

  // Create event (Club Admin only)
  createEvent: async (eventData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  },

  // Update event (Club Admin only)
  updateEvent: async (id: number, eventData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  },

  // Delete event (Club Admin only)
  deleteEvent: async (id: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// =========================
// MEMBERSHIP API
// =========================
export const membershipAPI = {
  // Join a club
  joinClub: async (userId: number, clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, clubId }),
    });
    return response.json();
  },

  // Leave a club
  leaveClub: async (userId: number, clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/leave?userId=${userId}&clubId=${clubId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get user memberships
  getUserMemberships: async (userId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get club members
  getClubMembers: async (clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/club/${clubId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// =========================
// ADMIN API
// =========================
export const adminAPI = {
  // Get all users (Super Admin only)
  getAllUsers: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get all clubs (Admin)
  getAllClubs: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/clubs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get club admins (Super Admin only)
  getClubAdmins: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/club-admins`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Create club admin (Super Admin only)
  createClubAdmin: async (userData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/club-admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Update user (Super Admin only)
  updateUser: async (id: number, userData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Delete user (Super Admin only)
  deleteUser: async (id: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
