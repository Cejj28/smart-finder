// ============================================
// Mock Data — seed data for local state
// ============================================
// Header notifications
export const notifications = [
    { id: 1, message: 'New lost item report: iPhone 13', time: '2 min ago' },
    { id: 2, message: 'Juan Dela Cruz claimed a wallet', time: '15 min ago' },
    { id: 3, message: 'New found item: Blue Tumbler', time: '1 hr ago' },
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
