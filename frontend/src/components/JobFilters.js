import React from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

const JobFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'selected', label: 'Selected' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'company', label: 'Company A-Z' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'status', label: 'By Status' }
  ];

  return (
    <div className="filters-container">
      <div className="filter-group filter-search">
        <Search size={18} className="filter-icon" />
        <input
          type="text"
          placeholder="Search by company, title, or notes..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <Filter size={18} className="filter-icon" />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
          className="filter-select"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <SortAsc size={18} className="filter-icon" />
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
          className="filter-select"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {(filters.search || filters.status !== 'all') && (
        <button
          onClick={() => onFilterChange({ search: '', status: 'all', sort: 'newest', page: 1 })}
          className="btn btn-ghost btn-sm clear-filters"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default JobFilters;
