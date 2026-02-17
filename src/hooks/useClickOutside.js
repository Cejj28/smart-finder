import { useEffect } from 'react';

/**
 * Custom hook that closes a dropdown/modal when clicking outside of it.
 * @param {React.RefObject} ref - Ref attached to the element to detect outside clicks for
 * @param {Function} onClose - Callback to run when an outside click is detected
 */
function useClickOutside(ref, onClose) {
    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [ref, onClose]);
}

export default useClickOutside;
