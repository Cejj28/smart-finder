import { useState, useMemo } from 'react';

/**
 * Reusable hook for search/filter pattern.
 * Memoizes the filtered result so it only recomputes when data or searchTerm changes.
 *
 * @param {Array} items - The full array to filter
 * @param {string[]} fields - Property names to search within
 * @returns {{ searchTerm, setSearchTerm, filtered }}
 */
function useSearch(items, fields) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = useMemo(() => {
        if (!searchTerm) return items;
        const lower = searchTerm.toLowerCase();
        return items.filter(item =>
            fields.some(field => {
                const value = item[field];
                return value && String(value).toLowerCase().includes(lower);
            })
        );
    }, [items, searchTerm, fields]);

    return { searchTerm, setSearchTerm, filtered };
}

export default useSearch;
