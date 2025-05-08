
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type FeedType = 'new' | 'top-day' | 'top-week' | 'top-all';

interface FeedFiltersProps {
  onFilterChange: (filter: FeedType) => void;
}

const FeedFilters = ({ onFilterChange }: FeedFiltersProps) => {
  const [activeFilter, setActiveFilter] = useState<FeedType>('new');
  
  const handleFilterChange = (filter: FeedType) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex justify-between items-center mb-6 overflow-x-auto pb-2">
      <Tabs value={activeFilter} onValueChange={(v) => handleFilterChange(v as FeedType)}>
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="top-day">Top 24h</TabsTrigger>
          <TabsTrigger value="top-week">Top Week</TabsTrigger>
          <TabsTrigger value="top-all">All Time</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default FeedFilters;
