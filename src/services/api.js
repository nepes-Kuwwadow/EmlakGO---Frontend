const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('emlakgo_token') || null;
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('emlakgo_token', token);
  } else {
    localStorage.removeItem('emlakgo_token');
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem('emlakgo_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('emlakgo_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('emlakgo_user');
  }
}

export async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // If body is not FormData, set Content-Type JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || (typeof data === 'string' ? data : 'Haýyş ýerine ýetirilmedi.')
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function formatPrice(price) {
  if (!price && price !== 0) return '0 TMT';
  return Number(price).toLocaleString('tk-TM') + ' TMT';
}

const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

export function resolveImageUrl(path) {
  if (!path) return DEFAULT_FALLBACK_IMAGE;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  if (clean.startsWith('storage/')) {
    return `${BACKEND_BASE}/${clean}`;
  }
  return `${BACKEND_BASE}/storage/${clean}`;
}

export const api = {
  // Auth
  register(userData) {
    return request('/auth/register', { method: 'POST', body: userData });
  },
  login(credentials) {
    return request('/auth/login', { method: 'POST', body: credentials });
  },
  logout() {
    return request('/auth/logout', { method: 'POST' });
  },
  getMe() {
    return request('/auth/me');
  },

  // Categories
  getCategories() {
    return request('/categories');
  },

  // Properties
  getProperties(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return request(`/properties${queryString ? `?${queryString}` : ''}`);
  },

  getProperty(id) {
    return request(`/properties/${id}`);
  },

  createProperty(formData) {
    return request('/properties', {
      method: 'POST',
      body: formData, // FormData instance
    });
  },

  updateProperty(id, data) {
    return request(`/properties/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  deleteProperty(id) {
    return request(`/properties/${id}`, {
      method: 'DELETE',
    });
  },

  // Inquiries
  sendInquiry(propertyId, data) {
    return request(`/properties/${propertyId}/inquiries`, {
      method: 'POST',
      body: data,
    });
  },

  // Favorites
  getFavorites(page = 1) {
    return request(`/favorites?page=${page}`);
  },

  toggleFavorite(propertyId) {
    return request(`/properties/${propertyId}/favorite`, {
      method: 'POST',
    });
  },

  // Kommentariýalar (Comments)
  getComments(propertyId) {
    return request(`/properties/${propertyId}/comments`);
  },

  addComment(propertyId, data) {
    return request(`/properties/${propertyId}/comments`, {
      method: 'POST',
      body: data,
    });
  },

  replyComment(propertyId, parentId, data) {
    return request(`/properties/${propertyId}/comments`, {
      method: 'POST',
      body: { ...data, parent_id: parentId },
    });
  },

  deleteComment(commentId) {
    return request(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};
