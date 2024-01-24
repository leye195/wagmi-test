import { useEffect, useState } from "react";

const useMountTransition = (isMounted: boolean, unmountDelay: number) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isMounted && !isTransitioning) {
      setIsTransitioning(true);
    } else if (!isMounted && isTransitioning) {
      timeoutId = setTimeout(() => setIsTransitioning(false), unmountDelay);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMounted, unmountDelay, isTransitioning]);

  return isTransitioning;
};

export default useMountTransition;
