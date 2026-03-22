// API Base URL - Production: /api (Vercel rewrites), Development: localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Optional: redirect to login page
          // window.location.href = '/signin';
        }
      }
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
};

// Helper to get auth token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ==================== AUTH API ====================
export const authAPI = {
  register: async (phoneNumber, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, password })
    });
    return handleResponse(response);
  },

  login: async (phoneNumber, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, password })
    });
    const data = await handleResponse(response);
    // Store token in localStorage on successful login
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// ==================== PROFILE API ====================
export const profileAPI = {
  createProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  uploadProfilePicture: async (imageData) => {
    const response = await fetch(`${API_URL}/profile/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(imageData)
    });
    return handleResponse(response);
  }
};

// ==================== CROP API ====================
export const cropAPI = {
  getAllCrops: async () => {
    const response = await fetch(`${API_URL}/crops`);
    return handleResponse(response);
  },

  getCropById: async (id) => {
    const response = await fetch(`${API_URL}/crops/${id}`);
    return handleResponse(response);
  },

  addCrop: async (cropData) => {
    const response = await fetch(`${API_URL}/crops`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cropData)
    });
    return handleResponse(response);
  },

  updateCrop: async (id, cropData) => {
    const response = await fetch(`${API_URL}/crops/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cropData)
    });
    return handleResponse(response);
  },

  deleteCrop: async (id) => {
    const response = await fetch(`${API_URL}/crops/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== SEASON API ====================
export const seasonAPI = {
  startSeason: async (seasonData) => {
    const response = await fetch(`${API_URL}/seasons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(seasonData)
    });
    return handleResponse(response);
  },

  getActiveSeasons: async () => {
    const response = await fetch(`${API_URL}/seasons/active`);
    return handleResponse(response);
  },

  getSeasonById: async (id) => {
    const response = await fetch(`${API_URL}/seasons/${id}`);
    return handleResponse(response);
  },

  getAllSeasons: async () => {
    const response = await fetch(`${API_URL}/seasons`);
    return handleResponse(response);
  },

  endSeason: async (id) => {
    const response = await fetch(`${API_URL}/seasons/${id}/end`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== REGISTRATION API ====================
export const registrationAPI = {
  registerCrop: async (registrationData) => {
    const response = await fetch(`${API_URL}/registrations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(registrationData)
    });
    return handleResponse(response);
  },

  getMyRegistrations: async () => {
    const response = await fetch(`${API_URL}/registrations/my`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getAllRegistrations: async () => {
    const response = await fetch(`${API_URL}/registrations`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getRegistrationById: async (id) => {
    const response = await fetch(`${API_URL}/registrations/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  approveRegistration: async (id) => {
    const response = await fetch(`${API_URL}/registrations/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  rejectRegistration: async (id) => {
    const response = await fetch(`${API_URL}/registrations/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  completeRegistration: async (id, data) => {
    const response = await fetch(`${API_URL}/registrations/${id}/complete`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateRegistration: async (id, data) => {
    const response = await fetch(`${API_URL}/registrations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteRegistration: async (id) => {
    const response = await fetch(`${API_URL}/registrations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== FARMER API ====================
export const farmerAPI = {
  getAllFarmers: async () => {
    const response = await fetch(`${API_URL}/farmers`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getFarmerById: async (id) => {
    const response = await fetch(`${API_URL}/farmers/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateFarmer: async (id, farmerData) => {
    const response = await fetch(`${API_URL}/farmers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(farmerData)
    });
    return handleResponse(response);
  },

  deleteFarmer: async (id) => {
    const response = await fetch(`${API_URL}/farmers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== EXPORT ALL ====================
const api = {
  authAPI,
  profileAPI,
  cropAPI,
  seasonAPI,
  registrationAPI,
  farmerAPI
};

export default api;