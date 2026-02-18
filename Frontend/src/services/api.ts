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
    const data = await parseResponse(response);
    // Return full response with success field
    if (data.success !== undefined) {
      return data; // Already has success field
    }
    return { success: true, clubs: data.clubs || data };
  },

  // Get club by ID
  getClubById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/clubs/${id}`);
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, club: data.club || data };
  },

  // Get club events
  getClubEvents: async (clubId: number) => {
    const response = await fetch(`${API_BASE_URL}/events/club/${clubId}`);
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, events: data.events || data };
  },

  // Get club members
  getClubMembers: async (clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/club/${clubId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, memberships: data.data || data || [] };
  },

  // Get clubs by admin ID
  getClubsByAdmin: async (adminId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/clubs/admin/${adminId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, clubs: data.clubs || data };
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
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, club: data.club || data };
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
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, club: data.club || data };
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
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, events: data.events || data };
  },

  // Get event by ID
  getEventById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, event: data.event || data };
  },

  // Get events by club
  getEventsByClub: async (clubId: number) => {
    const response = await fetch(`${API_BASE_URL}/events/club/${clubId}`);
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, events: data.events || data };
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
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, event: data.event || data };
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
    const data = await parseResponse(response);
    if (data.success !== undefined) {
      return data;
    }
    return { success: true, event: data.event || data };
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

  // Join a club after successful payment
  joinClubAfterPayment: async (userId: number, clubId: number, paymentId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/memberships/join-after-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, clubId, paymentId }),
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
// PAYMENT API (Stripe Integration)
// =========================
// Helper function to get absolute URL for payment callbacks
// Constructs full URLs with the current domain for Stripe
const getAbsoluteUrl = (relativePath: string): string => {
  const { protocol, hostname, port } = window.location;
  const baseUrl = `${protocol}//${hostname}${port ? ':' + port : ''}`;
  return baseUrl + relativePath;
};

export const paymentAPI = {
  // Create a Stripe checkout session
  createCheckoutSession: async (userId: number, clubId: number, amount: number, currency: string = 'LKR') => {
    const token = getToken();
    
    // Build absolute URLs for Stripe (Stripe requires full URLs, not relative paths)
    // Examples: http://localhost:3000/payment-success or https://example.com/payment-success
    const successUrl = getAbsoluteUrl('/payment-success');
    const cancelUrl = getAbsoluteUrl('/payment-cancel');
    
    // Validate inputs
    if (!userId || !clubId || !amount || amount <= 0) {
      throw new Error('Invalid payment parameters: userId, clubId, and amount (> 0) are required');
    }
    
    // Build request payload as proper object
    // Ensure amount is a decimal number with proper precision
    const requestPayload = {
      userId: Number(userId),
      clubId: Number(clubId),
      amount: Number(parseFloat(amount.toString()).toFixed(2)), // Ensure 2 decimal places
      currency: currency,
      successUrl: successUrl,
      cancelUrl: cancelUrl,
    };
    
    console.log('🔵 Payment API Request:', JSON.stringify(requestPayload, null, 2));
    console.log('Amount type:', typeof requestPayload.amount, 'Value:', requestPayload.amount);
    
    const response = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestPayload),
    });
    return parseResponse(response);
  },

  // Get payment details
  getPayment: async (paymentId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Get payment by session ID
  getPaymentBySession: async (sessionId: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/payments/session/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Verify if payment is successful
  verifyPayment: async (paymentId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Confirm payment status by checking with Stripe
  // This updates the database if payment has succeeded in Stripe
  confirmPayment: async (paymentId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    const data = await parseResponse(response);
    return data.data || data.users || [];
  },

  // Get users by role
  getUsersByRole: async (role: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/role/${role}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await parseResponse(response);
    return data.data || data.users || [];
  },

  // Get all clubs (Admin)
  getAllClubs: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/clubs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await parseResponse(response);
    return data.data || data.clubs || [];
  },

  // Get club admins (Super Admin only)
  getClubAdmins: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/club-admins`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await parseResponse(response);
    return data.data || data.clubAdmins || [];
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
    const data = await parseResponse(response);
    return data.data || data.user || data;
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
    const data = await parseResponse(response);
    return data.data || data.user || data;
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

// =========================
// FILE UPLOAD API
// =========================
export const fileAPI = {
  // Upload image file
  uploadImage: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return parseResponse(response);
  },

  // Upload image with base64
  uploadImageBase64: async (base64Data: string, fileName: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/upload/image/base64`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        base64: base64Data,
        fileName: fileName,
      }),
    });
    return parseResponse(response);
  },
};

// =========================
// ANNOUNCEMENT API
// =========================
export const announcementAPI = {
  // Create a new announcement (draft)
  createAnnouncement: async (announcementData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(announcementData),
    });
    return parseResponse(response);
  },

  // Get all announcements (admin)
  getAllAnnouncements: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Get announcement by ID
  getAnnouncementById: async (id: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Get all announcements by club (admin view - all drafts and published)
  getAllAnnouncementsByClub: async (clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/club/${clubId}/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Get published announcements by club (student view)
  getPublishedAnnouncementsByClub: async (clubId: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/club/${clubId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Get announcements by creator
  getAnnouncementsByCreator: async (createdBy: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/creator/${createdBy}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Get announcements by club and creator
  getAnnouncementsByClubAndCreator: async (clubId: number, createdBy: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/club/${clubId}/creator/${createdBy}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Update announcement
  updateAnnouncement: async (id: number, announcementData: any) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(announcementData),
    });
    return parseResponse(response);
  },

  // Publish an announcement
  publishAnnouncement: async (id: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/${id}/publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Unpublish an announcement
  unpublishAnnouncement: async (id: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/${id}/unpublish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  // Delete an announcement
  deleteAnnouncement: async (id: number) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },
};
