import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import '../styles/App.css';

function Dashboard() {
    const [searchTerm, VXSearchTerm] = useState('');

    const stats = {
        totalLost: 42,
        totalFound: 18,
        pendingClaims: 5
    };

    const recentItems = [
        { id: 101, type: 'Lost', item: 'Iphone 13', location: 'Library', status: 'Pending' },
        { id: 102, type: 'Found', item: 'Blue Tumbler', location: 'Canteen', status: 'In Storage' },
        { id: 103, type: 'Lost', item: 'ID Lace', location: 'Gym', status: 'Returned' },
        { id: 104, type: 'Found', item: 'Calculus Book', location: 'Room 304', status: 'In Storage' },
    ];

    // Filter logic
    const filteredItems = recentItems.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="dashboard-container">
            <header className="dashboard-header">
                <h1>SmartFinder Admin Dashboard</h1>
                <p>Welcome back, Admin.</p>
            </header>

            <section className="stats-grid">
                <StatCard title="Total Lost Items" count={stats.totalLost} />
                <StatCard title="Total Found Items" count={stats.totalFound} />
                <StatCard title="Pending Claims" count={stats.pendingClaims} variant="warning" />
            </section>

            <section className="recent-activity">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>Recent Reports</h2>
                    <input
                        type="text"
                        placeholder="Search items or location..."
                        value={searchTerm}
                        onChange={(e) => VXSearchTerm(e.target.value)}
                        style={{
                            padding: '0.75rem 1.25rem',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e0',
                            width: '500px',
                            fontSize: '1rem',
                            outline: 'none',
                        }}
                    />
                </div>

                <div className="table-wrapper">
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
                            {filteredItems.map((report) => (
                                <tr key={report.id}>
                                    <td><StatusBadge status={report.type} /></td>
                                    <td>{report.item}</td>
                                    <td>{report.location}</td>
                                    <td><StatusBadge status={report.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredItems.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>No items found.</p>
                    )}
                </div>
            </section>

        </main>
    );
}

export default Dashboard;