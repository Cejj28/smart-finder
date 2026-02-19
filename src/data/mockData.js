// ============================================
// Mock Data — replace with API calls later
// ============================================

// Admin dashboard statistics (initial values)
export const dashboardStats = {
    pendingReview: 12,
    approvedToday: 8,
    totalReports: 60,
    rejected: 3,
};

// Recent item reports
export const recentItems = [
    { id: 101, type: 'Lost', item: 'Iphone 13', location: 'Library', submittedBy: 'Juan Dela Cruz', date: '2026-02-17', status: 'Pending Review' },
    { id: 102, type: 'Found', item: 'Blue Tumbler', location: 'Canteen', submittedBy: 'Maria Santos', date: '2026-02-17', status: 'Pending Review' },
    { id: 103, type: 'Lost', item: 'ID Lace', location: 'Gym', submittedBy: 'Pedro Reyes', date: '2026-02-16', status: 'Approved' },
    { id: 104, type: 'Found', item: 'Calculus Book', location: 'Room 304', submittedBy: 'Ana Garcia', date: '2026-02-16', status: 'Approved' },
    { id: 105, type: 'Lost', item: 'Black Wallet', location: 'Parking Lot', submittedBy: 'Carlos Mendoza', date: '2026-02-15', status: 'Rejected' },
    { id: 106, type: 'Found', item: 'USB Flash Drive', location: 'Computer Lab', submittedBy: 'Lisa Aquino', date: '2026-02-15', status: 'Claimed' },
];

// Header notifications
export const notifications = [
    { id: 1, message: 'New lost item report: iPhone 13', time: '2 min ago' },
    { id: 2, message: 'Juan Dela Cruz claimed a wallet', time: '15 min ago' },
    { id: 3, message: 'New found item: Blue Tumbler', time: '1 hr ago' },
];

// Pending posts for verification
export const pendingPosts = [
    { id: 201, type: 'Lost', item: 'Samsung Galaxy S23', location: 'Library 2F', reporter: 'Mark Villanueva', date: '2026-02-18', description: 'Black phone with clear case', status: 'Pending' },
    { id: 202, type: 'Found', item: 'Red Umbrella', location: 'Lobby', reporter: 'Sarah Lee', date: '2026-02-18', description: 'Left near the entrance guard', status: 'Pending' },
    { id: 203, type: 'Lost', item: 'Silver Earbuds', location: 'Room 201', reporter: 'Angelo Torres', date: '2026-02-17', description: 'JBL earbuds in white case', status: 'Pending' },
    { id: 204, type: 'Found', item: 'Student ID', location: 'Canteen', reporter: 'Rica Gomez', date: '2026-02-17', description: 'ID belongs to CS department', status: 'Pending' },
    { id: 205, type: 'Lost', item: 'Laptop Charger', location: 'Computer Lab', reporter: 'Dennis Ramos', date: '2026-02-16', description: 'Lenovo 65W charger', status: 'Verified' },
];

// Claims data
export const claimsData = [
    { id: 301, claimant: 'Juan Dela Cruz', item: 'Black Wallet', proof: 'Described contents accurately', contact: '09171234567', date: '2026-02-18', status: 'Pending', releaseDate: '' },
    { id: 302, claimant: 'Maria Santos', item: 'USB Flash Drive', proof: 'Showed purchase receipt', contact: 'maria@email.com', date: '2026-02-17', status: 'Approved', releaseDate: '2026-02-18' },
    { id: 303, claimant: 'Pedro Reyes', item: 'Calculus Book', proof: 'Name written on first page', contact: '09181234567', date: '2026-02-17', status: 'Pending', releaseDate: '' },
    { id: 304, claimant: 'Unknown Claimant', item: 'ID Lace', proof: 'Could not verify ownership', contact: 'N/A', date: '2026-02-16', status: 'Rejected', releaseDate: '' },
];

// Users data
export const usersData = [
    { id: 401, name: 'Juan Dela Cruz', email: 'juan@university.edu', role: 'Student', status: 'Active' },
    { id: 402, name: 'Maria Santos', email: 'maria@university.edu', role: 'Student', status: 'Active' },
    { id: 403, name: 'Pedro Reyes', email: 'pedro@university.edu', role: 'Student', status: 'Active' },
    { id: 404, name: 'Ana Garcia', email: 'ana@university.edu', role: 'Faculty', status: 'Active' },
    { id: 405, name: 'Carlos Mendoza', email: 'carlos@university.edu', role: 'Student', status: 'Inactive' },
    { id: 406, name: 'Lisa Aquino', email: 'lisa@university.edu', role: 'Staff', status: 'Active' },
];

// Admin profile
export const adminProfile = {
    name: 'Admin User',
    email: 'admin@ustp.edu',
    phone: '09170000000',
    bio: 'System administrator for SmartFinder Lost & Found Management System.',
    role: 'Super Admin',
};

// Reports — all item activity
export const allReports = [
    { id: 501, type: 'Lost', item: 'Iphone 13', location: 'Library', reporter: 'Juan Dela Cruz', date: '2026-02-17', status: 'Pending Review' },
    { id: 502, type: 'Found', item: 'Blue Tumbler', location: 'Canteen', reporter: 'Maria Santos', date: '2026-02-17', status: 'Pending Review' },
    { id: 503, type: 'Lost', item: 'ID Lace', location: 'Gym', reporter: 'Pedro Reyes', date: '2026-02-16', status: 'Approved' },
    { id: 504, type: 'Found', item: 'Calculus Book', location: 'Room 304', reporter: 'Ana Garcia', date: '2026-02-16', status: 'Approved' },
    { id: 505, type: 'Lost', item: 'Black Wallet', location: 'Parking Lot', reporter: 'Carlos Mendoza', date: '2026-02-15', status: 'Rejected' },
    { id: 506, type: 'Found', item: 'USB Flash Drive', location: 'Computer Lab', reporter: 'Lisa Aquino', date: '2026-02-15', status: 'Claimed' },
    { id: 507, type: 'Lost', item: 'Samsung Galaxy S23', location: 'Library 2F', reporter: 'Mark Villanueva', date: '2026-02-14', status: 'Approved' },
    { id: 508, type: 'Found', item: 'Red Umbrella', location: 'Lobby', reporter: 'Sarah Lee', date: '2026-02-13', status: 'Claimed' },
    { id: 509, type: 'Lost', item: 'Silver Earbuds', location: 'Room 201', reporter: 'Angelo Torres', date: '2026-02-12', status: 'Pending Review' },
    { id: 510, type: 'Found', item: 'Student ID', location: 'Canteen', reporter: 'Rica Gomez', date: '2026-02-11', status: 'Approved' },
];
