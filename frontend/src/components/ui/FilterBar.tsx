import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterField {
  name: string;
  placeholder: string;
  options: FilterOption[];
  value: string;
  onChange: (val: string) => void;
}

interface FilterBarProps {
  fields: FilterField[];
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  onClear?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  fields,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onClear,
}) => {
  return (
    <div className="bg-panel border border-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-3 items-center w-full">
      {onSearchChange !== undefined && (
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:border-accent focus:outline-none"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center w-full md:w-auto md:flex-1">
        {fields.map((field) => (
          <div key={field.name} className="w-full sm:w-44">
            <select
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-400 focus:border-accent focus:outline-none"
            >
              <option value="">{field.placeholder}</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {onClear && (
        <button
          onClick={onClear}
          className="text-xs font-semibold text-gray-400 hover:text-accent transition-colors self-start md:self-auto py-2"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
