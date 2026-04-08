const API_URL = 'http://localhost:8000/api';

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

export const loginApi = async (email, password) => {
    const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }) // Using email as username
    });
    
    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    return await response.json();
};

export const fetchItems = async () => {
    const response = await fetch(`${API_URL}/items/`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch items');
    const data = await response.json();
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
        image_url: item.image || null,
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

export const createItem = async ({ type, item_name, location, description, contact_info, imageFile }) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('item_name', item_name);
    formData.append('location', location);
    if (description) formData.append('description', description);
    if (contact_info) formData.append('contact_info', contact_info);
    if (imageFile) formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/items/`, {
        method: 'POST',
        headers: getAuthHeadersMultipart(),
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to create item');
    return await response.json();
};
