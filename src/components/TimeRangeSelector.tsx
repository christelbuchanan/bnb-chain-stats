import React from 'react';
import { Clock } from 'lucide-react';

interface TimeRangeSelectorProps {
  timeRange: string;
  onChange: (range: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ timeRange, onChange }) => {
  const ranges = [
    { value: '1d', label: '24 hours' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
  ];
  
  return (
    <div className="flex items-center">
      <Clock className="h-4 w-4 text-gray-500 mr-2" />
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {ranges.map((range) => (
          <button
            key={range.value}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === range.value
                ? 'bg-bnb-yellow text-bnb-dark font-medium'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => onChange(range.value)}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector;
