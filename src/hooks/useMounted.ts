import { useState, useEffect } from 'react';

function useMounted(condition?: boolean) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (condition) {
      setMounted(true);
      false;
    }

    if (condition === undefined) {
      setMounted(true);
    }
  }, [condition]);

  return mounted;
}

export default useMounted;
