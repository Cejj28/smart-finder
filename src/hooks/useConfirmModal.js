import { useState, useCallback } from 'react';

/**
 * Reusable hook for confirm modal state management.
 * Eliminates duplicated confirm state pattern across pages.
 *
 * @param {Object} actionMap - Maps action strings to { title, message, confirmLabel, variant }
 *   Can also be a function(action, items) that returns the props object.
 * @returns {{ confirm, openConfirm, closeConfirm, confirmProps }}
 */
function useConfirmModal(actionMap) {
    const [confirm, setConfirm] = useState({ open: false, id: null, action: '' });

    const openConfirm = useCallback((id, action) => {
        setConfirm({ open: true, id, action });
    }, []);

    const closeConfirm = useCallback(() => {
        setConfirm({ open: false, id: null, action: '' });
    }, []);

    const confirmProps = typeof actionMap === 'function'
        ? actionMap(confirm.action, confirm.id)
        : (actionMap[confirm.action] || {});

    return { confirm, openConfirm, closeConfirm, confirmProps };
}

export default useConfirmModal;
