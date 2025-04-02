import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ value, options, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        className="relative w-full bg-white pl-3 pr-10 py-2.5 border border-secondary-200 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {selectedOption?.icon && (
            <span className="mr-2 flex items-center">{selectedOption.icon}</span>
          )}
          <span className="block truncate text-secondary-900">
            {selectedOption?.label || 'Select option'}
          </span>
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className={`h-5 w-5 text-secondary-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl border border-secondary-200 overflow-hidden">
          <div className="max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`relative cursor-pointer select-none py-2.5 pl-3 pr-9 hover:bg-primary-50 transition-colors ${
                  value === option.value
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-900'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  {option.icon && (
                    <span className="mr-2 flex items-center">{option.icon}</span>
                  )}
                  <span className={`block truncate ${
                    value === option.value ? 'font-medium' : 'font-normal'
                  }`}>
                    {option.label}
                  </span>
                </div>

                {value === option.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;