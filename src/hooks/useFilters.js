import { useState, useCallback } from 'react';
import { ALL_CATS } from '../data/categories';

export function useFilters() {
  const [activeFilters, setActiveFilters] = useState(new Set(ALL_CATS));
  const [districtActive, setDistrictActive] = useState(null);
  const [hhOn, setHhOn] = useState(true);
  const [hhPatio, setHhPatio] = useState(false);
  const [hhRoof, setHhRoof] = useState(false);

  const toggleFilter = useCallback((cat) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const toggleAllCats = useCallback(() => {
    if (activeFilters.size === ALL_CATS.length) {
      // Deselect all: clear filters and turn off HH
      setActiveFilters(new Set());
      setHhOn(false);
      setHhPatio(false);
      setHhRoof(false);
      setDistrictActive(null);
    } else {
      // Select all: restore filters and turn HH back on
      setActiveFilters(new Set(ALL_CATS));
      setHhOn(true);
    }
  }, [activeFilters]);

  const toggleDistrict = useCallback((dist) => {
    setDistrictActive(prev => prev === dist ? null : dist);
  }, []);

  const toggleHH = useCallback(() => setHhOn(prev => !prev), []);
  const toggleHHPatio = useCallback(() => setHhPatio(prev => !prev), []);
  const toggleHHRoof = useCallback(() => setHhRoof(prev => !prev), []);

  const resetAll = useCallback(() => {
    setActiveFilters(new Set(ALL_CATS));
    setDistrictActive(null);
    setHhOn(true);
    setHhPatio(false);
    setHhRoof(false);
  }, []);

  return {
    activeFilters, districtActive, hhOn, hhPatio, hhRoof,
    toggleFilter, toggleAllCats, toggleDistrict,
    toggleHH, toggleHHPatio, toggleHHRoof, resetAll
  };
}
