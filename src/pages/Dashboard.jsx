import { useState } from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { dashboardStats, recentItems } from '../data/mockData';
import '../styles/App.css';

function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logic
    const filteredItems = recentItems.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="dashboard-container">
            <header className="dashboard-header">
                <h1>SmartFinder Admin Dashboard</h1>
                <p>Welcome back, Admin.</p>
            </header>

            <section className="stats-grid">
                <StatCard title="Pending Review" count={dashboardStats.pendingReview} variant="warning" />
                <StatCard title="Approved Today" count={dashboardStats.approvedToday} />
                <StatCard title="Total Reports" count={dashboardStats.totalReports} />
                <StatCard title="Rejected" count={dashboardStats.rejected} variant="danger" />
            </section>

            <section className="recent-activity">
                <div className="search-header">
                    <h2>Pending Post Verifications</h2>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search item, location, or student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Item Name</th>
                                <th>Submitted By</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((report) => (
                                <tr key={report.id}>
                                    <td><StatusBadge status={report.type} /></td>
                                    <td>{report.item}</td>
                                    <td>{report.submittedBy}</td>
                                    <td>{report.location}</td>
                                    <td className="date-cell">{report.date}</td>
                                    <td><StatusBadge status={report.status} /></td>
                                    <td>
                                        {report.status === 'Pending Review' ? (
                                            <>
                                                <button className="btn-approve">Approve</button>
                                                <button className="btn-reject">Reject</button>
                                            </>
                                        ) : (
                                            <span className="action-done">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredItems.length === 0 && (
                        <p className="empty-state">No items found.</p>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Dashboard;