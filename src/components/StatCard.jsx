import React from 'react';
import '../styles/App.css';

function StatCard({ title, count, variant }) {

    const cardClass = `card stat-card ${variant === 'warning' ? 'pending' : ''}`;

    return (
        <div className={cardClass}>
            <h3>{title}</h3>
            <p className="stat-number">{count}</p>
        </div>
    );
}

export default StatCard;