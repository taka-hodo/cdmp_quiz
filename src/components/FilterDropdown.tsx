import React, { useMemo } from 'react';
import { useQuizStore } from '../store/quizStore';
import type { FilterOption, DomainFilterOption } from '../types';

const FilterDropdown: React.FC = () => {
  const { filter, setFilter, domainFilter, setDomainFilter, questions, answerHistory } = useQuizStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as FilterOption);
  };
  
  const handleDomainFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDomainFilter(e.target.value as DomainFilterOption);
  };
  
  // Extract unique domains from questions
  const domains = useMemo(() => {
    const domainSet = new Set<string>();
    questions.forEach(q => {
      if (q.domain) {
        domainSet.add(q.domain);
      }
    });
    return Array.from(domainSet).sort();
  }, [questions]);

  return (
    <div className="w-full space-y-4">
      <div>
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
          表示フィルタ
        </label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">すべての問題</option>
          <option value="bookmarked">ブックマーク済み</option>
          <option value="correct">正解した問題</option>
          <option value="incorrect">不正解の問題</option>
        </select>
      </div>
      
      {domains.length > 0 && (
        <div>
          <label htmlFor="domainFilter" className="block text-sm font-medium text-gray-700 mb-2">
            ドメインフィルタ
          </label>
          <select
            id="domainFilter"
            value={domainFilter}
            onChange={handleDomainFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">すべてのドメイン</option>
            {domains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;