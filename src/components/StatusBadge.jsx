import React from 'react';

function StatusBadge({ status }) {
    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'lost': return 'tag-lost';
            case 'found': return 'tag-found';
            case 'returned': return 'tag-found';
            case 'pending': return 'tag-lost';
            default: return '';
        }
    };

    return (
        <span className={getStatusStyle(status)}>
            {status}
        </span>
    );
}

export default StatusBadge;