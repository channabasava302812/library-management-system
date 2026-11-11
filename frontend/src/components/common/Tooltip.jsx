import React, { useState } from 'react';

const Tooltip = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          className={`absolute z-50 whitespace-nowrap px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded-md shadow-lg pointer-events-none transition-all duration-150 ${positionClasses[position]}`}
        >
          {content}
          {/* Subtle Arrow */}
          <div
            className={`absolute w-0 h-0 border-x-4 border-x-transparent ${
              position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 border-t-4 border-t-slate-900'
                : 'bottom-full left-1/2 -translate-x-1/2 border-b-4 border-b-slate-900'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;