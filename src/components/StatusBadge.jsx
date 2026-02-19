function StatusBadge({ status }) {
    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'lost': return 'tag tag-lost';
            case 'found': return 'tag tag-found';
            case 'pending review': return 'tag tag-pending';
            case 'pending': return 'tag tag-pending';
            case 'approved': return 'tag tag-approved';
            case 'verified': return 'tag tag-approved';
            case 'rejected': return 'tag tag-rejected';
            case 'claimed': return 'tag tag-claimed';
            case 'released': return 'tag tag-released';
            default: return 'tag';
        }
    };

    return (
        <span className={getStatusStyle(status)}>
            {status}
        </span>
    );
}

export default StatusBadge;