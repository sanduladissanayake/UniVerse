// API Configuration - Simple and Easy to Understand
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Auth API Functions
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
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await api.post('/auth/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    studentId?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await api.post('/auth/register', userData);
    
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/me');
    return response.data;
  },
};

// Events Service
export const eventsService = {
  getEvents: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Event>> => {
    const response: AxiosResponse<PaginatedResponse<Event>> = await api.get('/events', { params });
    return response.data;
  },

  getEvent: async (id: string): Promise<ApiResponse<Event>> => {
    const response: AxiosResponse<ApiResponse<Event>> = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: CreateEventForm): Promise<ApiResponse<Event>> => {
    const response: AxiosResponse<ApiResponse<Event>> = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id: string, eventData: Partial<CreateEventForm>): Promise<ApiResponse<Event>> => {
    const response: AxiosResponse<ApiResponse<Event>> = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (eventId: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  unregisterFromEvent: async (eventId: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/events/${eventId}/register`);
    return response.data;
  },
};

// Clubs Service
export const clubsService = {
  getClubs: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Club>> => {
    const response: AxiosResponse<PaginatedResponse<Club>> = await api.get('/clubs', { params });
    return response.data;
  },

  getClub: async (id: string): Promise<ApiResponse<Club>> => {
    const response: AxiosResponse<ApiResponse<Club>> = await api.get(`/clubs/${id}`);
    return response.data;
  },

  createClub: async (clubData: CreateClubForm): Promise<ApiResponse<Club>> => {
    const response: AxiosResponse<ApiResponse<Club>> = await api.post('/clubs', clubData);
    return response.data;
  },

  updateClub: async (id: string, clubData: Partial<CreateClubForm>): Promise<ApiResponse<Club>> => {
    const response: AxiosResponse<ApiResponse<Club>> = await api.put(`/clubs/${id}`, clubData);
    return response.data;
  },

  deleteClub: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/clubs/${id}`);
    return response.data;
  },

  joinClub: async (clubId: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.post(`/clubs/${clubId}/join`);
    return response.data;
  },

  leaveClub: async (clubId: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/clubs/${clubId}/leave`);
    return response.data;
  },

  getClubMembers: async (clubId: string): Promise<ApiResponse<User[]>> => {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get(`/clubs/${clubId}/members`);
    return response.data;
  },
};

// Announcements Service
export const announcementsService = {
  getAnnouncements: async (params?: {
    page?: number;
    limit?: number;
    priority?: string;
  }): Promise<PaginatedResponse<Announcement>> => {
    const response: AxiosResponse<PaginatedResponse<Announcement>> = await api.get('/announcements', { params });
    return response.data;
  },

  getAnnouncement: async (id: string): Promise<ApiResponse<Announcement>> => {
    const response: AxiosResponse<ApiResponse<Announcement>> = await api.get(`/announcements/${id}`);
    return response.data;
  },

  createAnnouncement: async (announcementData: CreateAnnouncementForm): Promise<ApiResponse<Announcement>> => {
    const response: AxiosResponse<ApiResponse<Announcement>> = await api.post('/announcements', announcementData);
    return response.data;
  },

  updateAnnouncement: async (id: string, announcementData: Partial<CreateAnnouncementForm>): Promise<ApiResponse<Announcement>> => {
    const response: AxiosResponse<ApiResponse<Announcement>> = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  },

  deleteAnnouncement: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/announcements/${id}`);
    return response.data;
  },
};

// Users Service
export const usersService = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response: AxiosResponse<PaginatedResponse<User>> = await api.get('/users', { params });
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;