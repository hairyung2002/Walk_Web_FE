import React from 'react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterTabsProps {
  options: FilterOption[];
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ options, selectedFilter, onFilterChange }) => {
  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto px-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onFilterChange(option.id)}
          className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            selectedFilter === option.id
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
