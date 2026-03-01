import { useState, useMemo, useCallback } from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import useConfirmModal from '../hooks/useConfirmModal';
import useSearch from '../hooks/useSearch';
import { recentItems as initialItems } from '../data/mockData';
import '../styles/App.css';

const SEARCH_FIELDS = ['item', 'location', 'submittedBy'];

const CONFIRM_ACTIONS = {
    approve: {
        title: 'Approve Post',
        message: 'Are you sure you want to approve this post? It will be visible to all users.',
        confirmLabel: 'Approve',
        variant: 'primary',
    },
    reject: {
        title: 'Reject Post',
        message: 'Are you sure you want to reject this post? This action cannot be undone.',
        confirmLabel: 'Reject',
        variant: 'danger',
    },
};

function Dashboard() {
    const [items, setItems] = useState(initialItems);
    const { confirm, openConfirm, closeConfirm, confirmProps } = useConfirmModal(CONFIRM_ACTIONS);
    const { searchTerm, setSearchTerm, filtered: filteredItems } = useSearch(items, SEARCH_FIELDS);

    // Memoize stats so they only recompute when items change
    const stats = useMemo(() => ({
        pendingReview: items.filter(i => i.status === 'Pending Review').length,
        approvedToday: items.filter(i => i.status === 'Approved').length,
        totalReports: items.length,
        rejected: items.filter(i => i.status === 'Rejected').length,
    }), [items]);

    const handleConfirm = useCallback(() => {
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
        closeConfirm();
    }, [confirm, closeConfirm]);

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
                                                <button className="btn-approve" onClick={() => openConfirm(report.id, 'approve')}>Approve</button>
                                                <button className="btn-reject" onClick={() => openConfirm(report.id, 'reject')}>Reject</button>
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
                title={confirmProps.title}
                message={confirmProps.message}
                confirmLabel={confirmProps.confirmLabel}
                variant={confirmProps.variant}
                onConfirm={handleConfirm}
                onCancel={closeConfirm}
            />
        </main>
    );
}

export default Dashboard;