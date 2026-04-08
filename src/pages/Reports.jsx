import { useState, useMemo, useCallback, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import { fetchItems } from '../services/api';
import DetailPanel from '../components/DetailPanel';
import '../styles/Pages.css';

function Reports() {
    const [reports, setReports] = useState([]);
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchItems();
                setReports(data);
            } catch(e) {
                console.error(e);
            }
        }
        load();
    }, []);
    const [filters, setFilters] = useState({
        type: 'All',
        status: 'All',
        dateFrom: '',
        dateTo: '',
    });
    const [generated, setGenerated] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setGenerated(false);
    }, []);

    const handleGenerate = useCallback((e) => {
        e.preventDefault();
        setGenerated(true);
    }, []);

    const handleReset = useCallback(() => {
        setFilters({ type: 'All', status: 'All', dateFrom: '', dateTo: '' });
        setGenerated(false);
    }, []);

    // Memoize filtered reports so they only recompute when reports or filters change
    const filteredReports = useMemo(() =>
        reports.filter(r => {
            if (filters.type !== 'All' && r.type !== filters.type) return false;
            if (filters.status !== 'All' && r.status !== filters.status) return false;
            if (filters.dateFrom && r.date < filters.dateFrom) return false;
            if (filters.dateTo && r.date > filters.dateTo) return false;
            return true;
        }),
        [reports, filters]);

    // Memoize summary stats so they only recompute when filteredReports changes
    const summary = useMemo(() => ({
        total: filteredReports.length,
        lost: filteredReports.filter(r => r.type === 'Lost').length,
        found: filteredReports.filter(r => r.type === 'Found').length,
        pending: filteredReports.filter(r => r.status === 'Pending Review').length,
        approved: filteredReports.filter(r => r.status === 'Approved').length,
        claimed: filteredReports.filter(r => r.status === 'Claimed').length,
    }), [filteredReports]);

    const detailFields = [
        { label: 'Type', key: 'type', render: (val) => <StatusBadge status={val} /> },
        { label: 'Item Name', key: 'item_name' },
        { label: 'Location', key: 'location' },
        { label: 'Reported By', key: 'reporter' },
        { label: 'Date', key: 'date' },
        { label: 'Contact Info', key: 'contact_info' },
        { label: 'Status', key: 'status', render: (val) => <StatusBadge status={val} /> },
        { 
            label: 'Photo', 
            key: 'image_url', 
            render: (val) => val 
                ? <img src={val.startsWith('http') ? val : `http://localhost:8000${val}`} alt="Item" style={{ width: '100%', borderRadius: '8px', marginTop: '8px' }} /> 
                : <span style={{ color: '#94A3B8' }}>No photo available</span>
        },
    ];

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>Generate Reports</h1>
                <p>Filter and generate admin reports for lost &amp; found activity.</p>
            </div>

            {/* Filter Form */}
            <section className="form-card">
                <h2>Report Filters</h2>
                <form onSubmit={handleGenerate} className="page-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="rpt-type">Report Type</label>
                            <select id="rpt-type" name="type" value={filters.type} onChange={handleFilterChange}>
                                <option value="All">All Types</option>
                                <option value="Lost">Lost Items</option>
                                <option value="Found">Found Items</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rpt-status">Status</label>
                            <select id="rpt-status" name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="All">All Statuses</option>
                                <option value="Pending Review">Pending Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Claimed">Claimed</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="rpt-from">Date From</label>
                            <input id="rpt-from" type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rpt-to">Date To</label>
                            <input id="rpt-to" type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Generate Report</button>
                        <button type="button" className="btn-secondary" onClick={handleReset}>Reset Filters</button>
                    </div>
                </form>
            </section>

            {/* Generated Report */}
            {generated && (
                <>
                    {/* Summary */}
                    <div className="mini-stats">
                        <div className="mini-stat">
                            <span className="mini-stat-count">{summary.total}</span>
                            <span className="mini-stat-label">Total</span>
                        </div>
                        <div className="mini-stat">
                            <span className="mini-stat-count">{summary.lost}</span>
                            <span className="mini-stat-label">Lost</span>
                        </div>
                        <div className="mini-stat">
                            <span className="mini-stat-count">{summary.found}</span>
                            <span className="mini-stat-label">Found</span>
                        </div>
                        <div className="mini-stat">
                            <span className="mini-stat-count">{summary.pending}</span>
                            <span className="mini-stat-label">Pending</span>
                        </div>
                        <div className="mini-stat">
                            <span className="mini-stat-count">{summary.approved}</span>
                            <span className="mini-stat-label">Approved</span>
                        </div>
                        <div className="mini-stat">
                            <span className="mini-stat-count">{summary.claimed}</span>
                            <span className="mini-stat-label">Claimed</span>
                        </div>
                    </div>

                    <section className="table-card">
                        <h2>Report Results ({filteredReports.length} records)</h2>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Item Name</th>
                                        <th>Location</th>
                                        <th>Reporter</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map(r => (
                                        <tr key={r.id} className="clickable-row" onClick={() => setSelectedReport(r)}>
                                            <td><StatusBadge status={r.type} /></td>
                                            <td>{r.item_name}</td>
                                            <td>{r.location}</td>
                                            <td>{r.reporter}</td>
                                            <td className="date-cell">{r.date}</td>
                                            <td><StatusBadge status={r.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredReports.length === 0 && <p className="empty-state">No reports match your filters.</p>}
                        </div>
                    </section>

                    <DetailPanel
                        isOpen={!!selectedReport}
                        onClose={() => setSelectedReport(null)}
                        title="Report Record Details"
                        data={selectedReport || {}}
                        fields={detailFields}
                        actions={
                            <button className="btn-secondary" onClick={() => window.print()}>Print Record</button>
                        }
                    />
                </>
            )}
        </main>
    );
}

export default Reports;
