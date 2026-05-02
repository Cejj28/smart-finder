// ─────────────────────────────────────────────────────────────────────────────
// Django DRF — Primary backend (auth, CRUD, user management)
// ─────────────────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ─────────────────────────────────────────────────────────────────────────────
// FastAPI Analytics — Secondary service (read-only stats)
// ─────────────────────────────────────────────────────────────────────────────
const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8001';

const getAuthHeaders = () => {
    const token = localStorage.getItem('sf_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {})
    };
};

// For FormData (image upload) — do NOT set Content-Type, browser sets it with boundary
const getAuthHeadersMultipart = () => {
    const token = localStorage.getItem('sf_token');
    return token ? { 'Authorization': `Token ${token}` } : {};
};

// ─── DJANGO: Auth ─────────────────────────────────────────────────────────────

export const loginApi = async (identifier, password) => {
    const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password })
    });
    
    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    return await response.json();
};

// ─── DJANGO: Items ────────────────────────────────────────────────────────────

export const fetchItems = async () => {
    const response = await fetch(`${API_URL}/items/?admin=true`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch items');
    const data = await response.json();
    
    const BASE_SERVER_URL = API_URL.replace('/api', '');

    return data.map(item => ({
        id: item.id,
        type: item.type,
        item_name: item.item_name,
        location: item.location,
        submittedBy: item.reporter_username || 'Admin',
        reporter: item.reporter_username || 'Admin',
        date: new Date(item.created_at).toLocaleDateString(),
        description: item.description,
        contact_info: item.contact_info,
        category: item.category,
        // Ensure image_url is absolute (handle /media/, http://, or //res.cloudinary URLs)
        image_url: (item.image && typeof item.image === 'string') 
            ? (item.image.startsWith('http') ? item.image 
               : (item.image.startsWith('//') ? `https:${item.image}` 
               : `${BASE_SERVER_URL}${item.image}`))
            : null,
        status: item.status || 'Pending Review'
    }));
};

export const updateItemStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/items/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
};

export const createItem = async ({ type, item_name, location, description, contact_info, category, imageFile }) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('item_name', item_name);
    formData.append('location', location);
    if (description) formData.append('description', description);
    if (contact_info) formData.append('contact_info', contact_info);
    if (category) formData.append('category', category);
    if (imageFile) formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/items/`, {
        method: 'POST',
        headers: getAuthHeadersMultipart(),
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to create item');
    return await response.json();
};

// ─── DJANGO: Users ────────────────────────────────────────────────────────────

export const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    return data.map(user => ({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.is_staff ? 'Admin' : 'Student', 
        status: user.is_active ? 'Active' : 'Inactive'
    }));
};

export const createUser = async (userData) => {
    // Ensure the username is lowercase and has no spaces (extra safety)
    const sanitizedUsername = userData.username.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            username: sanitizedUsername,
            email: userData.email,
            password: 'password123',
            is_staff: userData.role === 'Admin',
            is_active: userData.status === 'Active'
        })
    });
    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
};

export const updateUser = async (id, userData) => {
    const sanitizedUsername = (userData.username || '').toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    const response = await fetch(`${API_URL}/users/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            username: sanitizedUsername,
            email: userData.email,
            is_staff: userData.role === 'Admin',
            is_active: userData.status === 'Active'
        })
    });
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
};

export const deleteUser = async (id) => {
    const response = await fetch(`${API_URL}/users/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return true;
};

// ─── FASTAPI: Analytics ───────────────────────────────────────────────────────
// All analytics calls use the same Django token (FastAPI verifies it against
// the shared authtoken_token table).

/** High-level summary: totals, lost/found split, status counts. */
export const fetchAnalyticsOverview = async () => {
    const response = await fetch(`${FASTAPI_URL}/stats/overview`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch analytics overview');
    return await response.json();
};

/** Count per type: [{type: "Lost", count: 5}, {type: "Found", count: 3}] */
export const fetchAnalyticsByType = async () => {
    const response = await fetch(`${FASTAPI_URL}/stats/by-type`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch type stats');
    return await response.json();
};

/** Count per status: [{status: "Pending Review", count: 4}, ...] */
export const fetchAnalyticsByStatus = async () => {
    const response = await fetch(`${FASTAPI_URL}/stats/by-status`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch status stats');
    return await response.json();
};

/** Top 10 locations by report count: [{location: "Library", count: 7}, ...] */
export const fetchAnalyticsByLocation = async () => {
    const response = await fetch(`${FASTAPI_URL}/stats/by-location`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch location stats');
    return await response.json();
};

/** Daily trend for last 30 days: [{date: "2025-04-01", count: 2}, ...] */
export const fetchAnalyticsTrends = async () => {
    const response = await fetch(`${FASTAPI_URL}/stats/trends`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch trend stats');
    return await response.json();
};

/** 5 most recent items: lightweight activity feed. */
export const fetchAnalyticsRecent = async () => {
    const response = await fetch(`${FASTAPI_URL}/stats/recent`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch recent items');
    return await response.json();
};

/** ML Category Predictor */
export const predictCategory = async (item_name, description = '') => {
    const response = await fetch(`${FASTAPI_URL}/predict/category`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ item_name, description })
    });
    if (!response.ok) throw new Error('Failed to predict category');
    return await response.json();
};
