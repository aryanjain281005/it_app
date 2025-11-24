import React from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';

const categories = [
  'All Categories',
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Moving',
  'Tutoring',
  'Beauty',
  'Photography',
  'Tailoring',
  'Computer Repair',
  'Home Repair'
];

const FilterSheet = ({ isOpen, onClose, selectedCategory, onCategoryChange, priceRange, onPriceChange, sortBy, onSortChange }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Bottom Sheet */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--md-sys-color-surface)',
        borderRadius: 'var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 0 0',
        maxHeight: '80vh',
        overflowY: 'auto',
        zIndex: 1001,
        animation: 'slideUp 0.3s ease-out',
        padding: '1.5rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="title-large">Filters</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} color="var(--md-sys-color-on-surface)" />
          </button>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="title-medium" style={{ marginBottom: '1rem' }}>Category</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === 'All Categories' ? '' : cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: (selectedCategory === cat || (cat === 'All Categories' && !selectedCategory))
                    ? 'var(--md-sys-color-primary)'
                    : 'var(--md-sys-color-surface-variant)',
                  color: (selectedCategory === cat || (cat === 'All Categories' && !selectedCategory))
                    ? 'var(--md-sys-color-on-primary)'
                    : 'var(--md-sys-color-on-surface-variant)',
                  transition: 'all 0.2s ease'
                }}
                className="label-large"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="title-medium" style={{ marginBottom: '1rem' }}>Price Range</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                border: '1px solid var(--md-sys-color-outline)',
                fontSize: '14px'
              }}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                border: '1px solid var(--md-sys-color-outline)',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Sort By */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="title-medium" style={{ marginBottom: '1rem' }}>Sort By</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating'].map((option) => (
              <button
                key={option}
                onClick={() => onSortChange(option)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--md-sys-shape-corner-small)',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  cursor: 'pointer',
                  backgroundColor: sortBy === option
                    ? 'var(--md-sys-color-primary-container)'
                    : 'transparent',
                  color: sortBy === option
                    ? 'var(--md-sys-color-on-primary-container)'
                    : 'var(--md-sys-color-on-surface)',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                className="body-medium"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <Button
          variant="filled"
          onClick={onClose}
          style={{ width: '100%', borderRadius: 'var(--md-sys-shape-corner-full)' }}
        >
          Apply Filters
        </Button>
      </div>
    </>
  );
};

export default FilterSheet;
