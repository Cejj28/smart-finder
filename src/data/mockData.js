// ============================================
// Mock Data — replace with API calls later
// ============================================

// Admin dashboard statistics
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
