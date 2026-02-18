// API Configuration - Simple Fetch Implementation
const API_BASE_URL = 'http://localhost:8081/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to safely parse JSON responses
const parseResponse = async (response: Response) => {
  // Check if response is ok first
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    } catch (e) {
      // If response is not JSON, throw with status text
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  
  // Check if there's content to parse
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return { success: true, data: null };
  }
  
  const text = await response.text();
  if (!text) {
    return { success: true, data: null };
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }
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
    return parseResponse(response);
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
    return parseResponse(response);
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
    return parseResponse(response);
  },
};

// =========================
// CLUB API
// =========================
export const clubAPI = {
  // Get all clubs
  getAllClubs: async () => {
    const response = await fetch(`${API_BASE_URL}/clubs`);
    return parseResponse(response);
  },

  // Get club by ID
  getClubById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/clubs/${id}`);
    return parseResponse(response);
  },

  // Get club events
  getClubEvents: async (clubId: number) => {
    const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/events`);
    return parseResponse(response);
  },

  // Get club members
  getClubMembers: async (clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/club/${clubId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
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
    return parseResponse(response);
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
    return parseResponse(response);
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
    return parseResponse(response);
  },
};

// =========================
// EVENT API
// =========================
export const eventAPI = {
  // Get all events
  getAllEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/events`);
    return parseResponse(response);
  },

  // Get event by ID
  getEventById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return parseResponse(response);
  },

  // Get events by club
  getEventsByClub: async (clubId: number) => {
    const response = await fetch(`${API_BASE_URL}/events/club/${clubId}`);
    return parseResponse(response);
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
    return parseResponse(response);
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
    return parseResponse(response);
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
    return parseResponse(response);
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
    return parseResponse(response);
  },

  // Join a club with membership form details (after payment)
  joinClubAfterPaymentWithDetails: async (formData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/join-after-payment-with-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    return parseResponse(response);
  },

  // Join a club with membership form details (free club)
  joinClubWithDetails: async (formData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/join-with-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    return parseResponse(response);
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
    return parseResponse(response);
  },

  // Get user memberships
  getUserMemberships: async (userId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Get club members
  getClubMembers: async (clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/club/${clubId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
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
    return parseResponse(response);
  },

  // Get all clubs (Admin)
  getAllClubs: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/clubs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Get club admins (Super Admin only)
  getClubAdmins: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/club-admins`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
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
    return parseResponse(response);
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
    return parseResponse(response);
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
    return parseResponse(response);
  },
};