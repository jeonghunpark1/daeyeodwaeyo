import React, { createContext, useState } from 'react';

// SearchContext 생성
export const SearchContext = createContext();

// Provider 컴포넌트 생성
export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState({
    query: '',
    searchImage: null,
    similarityImageProduct: [],
  });

  return (
    <SearchContext.Provider value={{ searchState, setSearchState }}>
      {children}
    </SearchContext.Provider>
  );
};
