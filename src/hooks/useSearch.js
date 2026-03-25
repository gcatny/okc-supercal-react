import { useState, useCallback, useMemo } from 'react';
import { matchesSearch } from '../utils/eventUtils';

export function useSearch(allEvents) {
  const [searchQuery, setSearchQuery] = useState('');
  const SEARCH_LIMIT = 50;
  const [searchShown, setSearchShown] = useState(SEARCH_LIMIT);
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allEvents.filter(ev => matchesSearch(ev, searchQuery));
  }, [allEvents, searchQuery]);

  const visibleResults = useMemo(() => {
    return searchResults.slice(0, searchShown);
  }, [searchResults, searchShown]);

  const onSearch = useCallback((val) => {
    setSearchQuery(val);
    setSearchShown(SEARCH_LIMIT);
    setIsOpen(val.trim().length > 0);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchShown(SEARCH_LIMIT);
    setIsOpen(false);
  }, []);

  const showMore = useCallback(() => {
    setSearchShown(prev => prev + SEARCH_LIMIT);
  }, []);

  return {
    searchQuery, searchResults, visibleResults, isOpen, setIsOpen,
    onSearch, clearSearch, showMore,
    hasMore: searchResults.length > searchShown
  };
}
