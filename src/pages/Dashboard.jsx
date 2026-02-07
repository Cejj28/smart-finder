import React from 'react';
import '../styles/App.css'; // We will use the main CSS file for simplicity

function Dashboard() {
    // 1. DYNAMIC DATA: Variables for Stats (Simulating DB counts)
    const stats = {
        totalLost: 42,
        totalFound: 18,
        pendingClaims: 5
    };

    // 2. DYNAMIC DATA: Array of Objects (Simulating a list of recent items)
    const recentItems = [
        { id: 101, type: 'Lost', item: 'Iphone 13', location: 'Library', status: 'Pending' },
        { id: 102, type: 'Found', item: 'Blue Tumbler', location: 'Canteen', status: 'In Storage' },
        { id: 103, type: 'Lost', item: 'ID Lace', location: 'Gate 2', status: 'Returned' },
        { id: 104, type: 'Found', item: 'Calculus Book', location: 'Room 304', status: 'In Storage' },
    ];

    return (
        <main className="dashboard-container">
            <header className="dashboard-header">
                <h1>SmartFinder Admin Dashboard</h1>
                <p>Welcome back, Admin.</p>
            </header>

            {/* Semantic HTML: Section for Key Metrics */}
            <section className="stats-grid">
                <div className="card stat-card">
                    <h3>Total Lost Items</h3>
                    <p className="stat-number">{stats.totalLost}</p>
                </div>
                <div className="card stat-card">
                    <h3>Total Found Items</h3>
                    <p className="stat-number">{stats.totalFound}</p>
                </div>
                <div className="card stat-card pending">
                    <h3>Pending Claims</h3>
                    <p className="stat-number">{stats.pendingClaims}</p>
                </div>
            </section>

            {/* Semantic HTML: Section for Recent Activity Table */}
            <section className="recent-activity">
                <h2>Recent Reports</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Item Name</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* dynamic rendering of the array */}
                        {recentItems.map((report) => (
                            <tr key={report.id}>
                                <td className={report.type === 'Lost' ? 'tag-lost' : 'tag-found'}>
                                    {report.type}
                                </td>
                                <td>{report.item}</td>
                                <td>{report.location}</td>
                                <td>{report.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

export default Dashboard;