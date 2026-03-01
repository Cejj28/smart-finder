import { memo } from 'react';
import '../styles/App.css';

const StatCard = memo(function StatCard({ title, count, variant }) {
    const variantClass = variant === 'warning' ? 'pending' : variant === 'danger' ? 'danger' : '';
    const cardClass = `stat-card ${variantClass}`;

    return (
        <div className={cardClass}>
            <h3>{title}</h3>
            <p className="stat-number">{count}</p>
        </div>
    );
});

export default StatCard;