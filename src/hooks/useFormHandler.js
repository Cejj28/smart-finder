import { useState, useCallback } from 'react';

/**
 * Reusable hook for form state + feedback management.
 * Eliminates duplicated form handling pattern across pages.
 *
 * @param {Object} initialValues - The initial/empty form values
 * @returns {{ form, setForm, feedback, setFeedback, handleChange, resetForm, showFeedback }}
 */
function useFormHandler(initialValues) {
    const [form, setForm] = useState(initialValues);
    const [feedback, setFeedback] = useState('');

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setForm(initialValues);
        setFeedback('');
    }, [initialValues]);

    /** Set feedback message that auto-clears after the given duration (ms). */
    const showFeedback = useCallback((message, duration = 3000) => {
        setFeedback(message);
        if (duration > 0) {
            setTimeout(() => setFeedback(''), duration);
        }
    }, []);

    return { form, setForm, feedback, setFeedback, handleChange, resetForm, showFeedback };
}

export default useFormHandler;
