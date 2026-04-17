import { apiCall, setAuthToken, clearAuthToken, getAuthToken } from './api';

// Auth Service
export const authService = {
  register: async (email: string, password: string, firstName: string, lastName?: string, phone?: string) => {
    const response = await apiCall('auth.php?action=register', {
      method: 'POST',
      body: { email, password, first_name: firstName, last_name: lastName, phone },
      requiresAuth: false,
    });

    if (response.success && response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  login: async (email: string, password: string) => {
    const response = await apiCall('auth.php?action=login', {
      method: 'POST',
      body: { email, password },
      requiresAuth: false,
    });

    if (response.success && response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  logout: async () => {
    try {
      await apiCall('auth.php?action=logout', {
        method: 'POST',
      });
    } finally {
      clearAuthToken();
    }
  },

  isAuthenticated: () => {
    return getAuthToken() !== null;
  },
};

// User Service
export const userService = {
  getProfile: async () => {
    return apiCall('user.php?action=profile', { method: 'GET' });
  },

  updateProfile: async (data: Record<string, any>) => {
    return apiCall('user.php?action=update', {
      method: 'POST',
      body: data,
    });
  },

  addTrustedContact: async (contactName: string, contactEmail: string, contactPhone?: string) => {
    return apiCall('user.php?action=add-contact', {
      method: 'POST',
      body: { contact_name: contactName, contact_email: contactEmail, contact_phone: contactPhone },
    });
  },

  getTrustedContacts: async () => {
    return apiCall('user.php?action=trusted-contacts', { method: 'GET' });
  },

  // Track user activity (heartbeat)
  updateLastActive: async () => {
    return apiCall('user.php?action=heartbeat', {
      method: 'POST',
      body: {},
    });
  },
};

// Feedback Service
export const feedbackService = {
  submit: async (data: { type: string; title: string; description: string; is_anonymous: boolean }) => {
    return apiCall('feedback.php?action=submit', {
      method: 'POST',
      body: data,
    });
  },

  getMyReports: async () => {
    return apiCall('feedback.php?action=my_reports', { method: 'GET' });
  },
};

// Announcement Service
export const announcementService = {
  getAll: async () => {
    return apiCall('announcements.php', {
      method: 'GET',
      requiresAuth: false,
    });
  },
};


// Admin Service
export const adminService = {
  // Get authorization token for admin operations
  setAdminToken: (token: string) => {
    localStorage.setItem('adminToken', token);
  },

  getAdminToken: () => {
    return localStorage.getItem('adminToken');
  },

  // Get all users with their stats
  getAllUsers: async () => {
    const token = adminService.getAdminToken();
    if (!token) throw new Error('Admin token not set');

    return apiCall('admin.php?action=all-users', {
      method: 'GET',
      customHeaders: { 'Authorization': `Bearer ${token}` },
      requiresAuth: false,
    });
  },

  // Get specific user's details and all interactions
  getUserDetails: async (userId: number) => {
    const token = adminService.getAdminToken();
    if (!token) throw new Error('Admin token not set');

    return apiCall(`admin.php?action=user-details&user_id=${userId}`, {
      method: 'GET',
      customHeaders: { 'Authorization': `Bearer ${token}` },
      requiresAuth: false,
    });
  },

  // Dashboard activity timeline for a user
  getUserActivity: async (userId: number, limit: number = 50) => {
    const token = adminService.getAdminToken();
    if (!token) throw new Error('Admin token not set');

    return apiCall(`admin.php?action=user-activity&user_id=${userId}&limit=${limit}`, {
      method: 'GET',
      customHeaders: { 'Authorization': `Bearer ${token}` },
      requiresAuth: false,
    });
  },

  // Get dashboard summary
  getDashboardSummary: async () => {
    const token = adminService.getAdminToken();
    if (!token) throw new Error('Admin token not set');

    return apiCall('admin.php?action=dashboard-summary', {
      method: 'GET',
      customHeaders: { 'Authorization': `Bearer ${token}` },
      requiresAuth: false,
    });
  },
};

// Doctor Service
export const doctorService = {
  getSchedule: async () => {
    return apiCall('doctors.php?action=get-schedule', {
      method: 'GET',
      requiresAuth: false,
    });
  },

  updateStatus: async (id: number, status: 'Available' | 'Busy' | 'Offline') => {
    return apiCall('doctors.php?action=update-status', {
      method: 'POST',
      body: { id, status },
      requiresAuth: false,
    });
  },
};

// Waiting List Service
export const waitingListService = {
  join: async (doctorId: number, purposeCategory: string, purposeDetail: string, priorityLevel: number, customReason?: string) => {
    return apiCall('waiting_list.php?action=join', {
      method: 'POST',
      body: { 
        doctor_id: doctorId, 
        purpose_category: purposeCategory, 
        purpose_detail: purposeDetail, 
        priority_level: priorityLevel,
        custom_reason: customReason
      },
    });
  },

  getStatus: async () => {
    return apiCall('waiting_list.php?action=status', {
      method: 'GET',
    });
  },

  async getAllAdmin() {
    return apiCall('waiting_list.php?action=admin_all', {
      method: 'GET',
      requiresAuth: true,
    });
  }
};

// Appointment Service
export const appointmentService = {
  async create(data: any) {
    // Assuming API_BASE is handled by apiCall and authentication by requiresAuth
    return apiCall('appointments.php?action=create', {
      method: 'POST',
      body: data,
      requiresAuth: true,
    });
  },

  async getMyAppointments() {
    return apiCall('appointments.php?action=my', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  async getAllAdmin() {
    return apiCall('appointments.php?action=admin_all', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  async updateStatus(id: number, status: string) {
    return apiCall('appointments.php?action=update_status', {
      method: 'PUT',
      body: { id, status },
      requiresAuth: true,
    });
  }
};

export const queueService = {
  async getStatus(doctorId?: number) {
    const url = doctorId
      ? `queue.php?action=status&doctor_id=${doctorId}`
      : `queue.php?action=status`;
    // Assuming apiCall handles API_BASE and other common headers
    return apiCall(url, { method: 'GET' });
  }
};
