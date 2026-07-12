import React from 'react';

interface SkeletonRowProps {
  cols: number;
}

const SkeletonRow: React.FC<SkeletonRowProps> = ({ cols }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
