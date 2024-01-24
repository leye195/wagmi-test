import { useEffect, useState } from 'react';

const useMediaQuery = (query: string) => {
  const getMatches = (query: string) => {
    if (typeof window === 'undefined') return false;

    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches(query));

  const handleChange = () => {
    setMatches(getMatches(query));
  };

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
};

export default useMediaQuery;
