// TEST CHANGE BY VLADYY - March 2026 - PIT WORK START
import { useState } from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { recentItems as initialItems } from '../data/mockData';

function Dashboard({ isDarkMode, toggleTheme }) {
    const [items, setItems] = useState(initialItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirm, setConfirm] = useState({ open: false, id: null, action: '' });

    // --- INLINE THEME DEFINITION ---
    const theme = {
        bg: isDarkMode ? '#1a1d21' : 'transparent',
        cardBg: isDarkMode ? '#24292e' : '#ffffff',
        text: isDarkMode ? '#ececec' : '#2d3436',
        subText: isDarkMode ? '#b1b1b1' : '#636e72',
        border: isDarkMode ? '#30363d' : '#edf2f7'
    };

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
        <main className="dashboard-container" style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100%', padding: '20px', transition: 'all 0.3s' }}>
            <header className="dashboard-header" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ color: isDarkMode ? '#00cec9' : '#00b894', margin: 0 }}>SmartFinder Admin Dashboard</h1>
                        <p style={{ color: theme.subText }}>Welcome back, Admin.</p>
                    </div>
                    
                    {/* Toggle button */}
                    <button 
                        onClick={toggleTheme}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.cardBg,
                            color: theme.text,
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>
            </header>

            <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* We apply the cardBg to your StatCards */}
                <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                    <StatCard title="Pending Review" count={stats.pendingReview} variant="warning" />
                </div>
                <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                    <StatCard title="Approved Today" count={stats.approvedToday} />
                </div>
                <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                    <StatCard title="Total Reports" count={stats.totalReports} />
                </div>
                <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                    <StatCard title="Rejected" count={stats.rejected} variant="danger" />
                </div>
            </section>

            <section className="recent-activity" style={{ backgroundColor: theme.cardBg, padding: '25px', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                <div className="search-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Pending Post Verifications</h2>
                    <input
                        type="text"
                        style={{
                            backgroundColor: isDarkMode ? '#1a1d21' : '#f1f3f5',
                            border: `1px solid ${theme.border}`,
                            color: theme.text,
                            padding: '10px',
                            borderRadius: '8px',
                            width: '300px'
                        }}
                        placeholder="Search item, location, or student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-wrapper">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: `2px solid ${theme.border}` }}>
                                <th style={{ padding: '12px' }}>Type</th>
                                <th style={{ padding: '12px' }}>Item Name</th>
                                <th style={{ padding: '12px' }}>Submitted By</th>
                                <th style={{ padding: '12px' }}>Location</th>
                                <th style={{ padding: '12px' }}>Date</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((report) => (
                                <tr key={report.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                    <td style={{ padding: '12px' }}><StatusBadge status={report.type} /></td>
                                    <td style={{ padding: '12px' }}>{report.item}</td>
                                    <td style={{ padding: '12px' }}>{report.submittedBy}</td>
                                    <td style={{ padding: '12px' }}>{report.location}</td>
                                    <td style={{ padding: '12px' }}>{report.date}</td>
                                    <td style={{ padding: '12px' }}><StatusBadge status={report.status} /></td>
                                    <td style={{ padding: '12px' }}>
                                        {report.status === 'Pending Review' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-approve" onClick={() => setConfirm({ open: true, id: report.id, action: 'approve' })}>Approve</button>
                                                <button className="btn-reject" onClick={() => setConfirm({ open: true, id: report.id, action: 'reject' })}>Reject</button>
                                            </div>
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <ConfirmModal
                isOpen={confirm.open}
                onConfirm={handleConfirm}
                onCancel={() => setConfirm({ open: false, id: null, action: '' })}
                {...confirm} 
            />
        </main>
    );
}

export default Dashboard;