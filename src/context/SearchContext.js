import { createElement, createContext, useContext, useState } from 'react';
import useDebounce from '../hooks/useDebounceHook';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm, 500);

  return createElement(
    SearchContext.Provider,
    { value: { searchTerm, setSearchTerm, debounceSearchTerm } },
    children
  );
};

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}