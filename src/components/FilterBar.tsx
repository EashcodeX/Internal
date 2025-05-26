import React from 'react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearAllFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, clearAllFilters }) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Filter implementation */}
    </div>
  );
};

export default FilterBar; 