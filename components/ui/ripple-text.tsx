import React, { useState } from 'react';

interface RippleTextProps {
  children: React.ReactNode;
  className?: string;
}

const RippleText: React.FC<RippleTextProps> = ({ 
  children, 
  className = '' 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getScale = (index: number): number => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    switch (distance) {
      case 0: return 1.5;
      case 1: return 1.3;
      case 2: return 1.1;
      default: return 1;
    }
  };

  return (
    <div className={`flex flex-nowrap items-center justify-center ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div
          className="transition-transform duration-200"
          style={{ transform: `scale(${getScale(index)})` }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default RippleText;