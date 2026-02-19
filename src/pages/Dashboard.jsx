import { useState } from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { recentItems as initialItems } from '../data/mockData';
import '../styles/App.css';

function Dashboard() {
    const [items, setItems] = useState(initialItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirm, setConfirm] = useState({ open: false, id: null, action: '' });

    // Compute stats from current state
    const stats = {
        pendingReview: items.filter(i => i.status === 'Pending Review').length,
        approvedToday: items.filter(i => i.status === 'Approved').length,
        totalReports: items.length,
        rejected: items.filter(i => i.status === 'Rejected').length,
    };

    const handleConfirm = () => {
        const { id, action } = confirm;
        if (action === 'approve') {
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, status: 'Approved' } : item
            ));
        } else if (action === 'reject') {
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, status: 'Rejected' } : item
            ));
        }
        setConfirm({ open: false, id: null, action: '' });
    };

    const filteredItems = items.filter(item =>
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
                <StatCard title="Pending Review" count={stats.pendingReview} variant="warning" />
                <StatCard title="Approved Today" count={stats.approvedToday} />
                <StatCard title="Total Reports" count={stats.totalReports} />
                <StatCard title="Rejected" count={stats.rejected} variant="danger" />
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
                                                <button className="btn-approve" onClick={() => setConfirm({ open: true, id: report.id, action: 'approve' })}>Approve</button>
                                                <button className="btn-reject" onClick={() => setConfirm({ open: true, id: report.id, action: 'reject' })}>Reject</button>
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

            <ConfirmModal
                isOpen={confirm.open}
                title={confirm.action === 'approve' ? 'Approve Post' : 'Reject Post'}
                message={confirm.action === 'approve'
                    ? 'Are you sure you want to approve this post? It will be visible to all users.'
                    : 'Are you sure you want to reject this post? This action cannot be undone.'}
                confirmLabel={confirm.action === 'approve' ? 'Approve' : 'Reject'}
                variant={confirm.action === 'approve' ? 'primary' : 'danger'}
                onConfirm={handleConfirm}
                onCancel={() => setConfirm({ open: false, id: null, action: '' })}
            />
        </main>
    );
}

export default Dashboard;