import { memo } from 'react';

//Rauto

const STATUS_CLASS_MAP = {
    'lost': 'tag tag-lost',
    'found': 'tag tag-found',
    'pending review': 'tag tag-pending',
    'pending': 'tag tag-pending',
    'approved': 'tag tag-approved',
    'verified': 'tag tag-approved',
    'rejected': 'tag tag-rejected',
    'claimed': 'tag tag-claimed',
    'released': 'tag tag-released',
};

const StatusBadge = memo(function StatusBadge({ status }) {
    const className = STATUS_CLASS_MAP[status.toLowerCase()] || 'tag';

    return (
        <span className={className}>
            {status}
        </span>
    );
});

export default StatusBadge;