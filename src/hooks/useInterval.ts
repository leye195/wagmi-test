import { useEffect, useRef } from 'react';

type props = {
  (callback: () => void, delay: number): void;
};

const useInterval: props = (callback, delay) => {
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
