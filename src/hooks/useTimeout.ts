import { DependencyList } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

type Props = {
  callback: () => void;
  cleanup?: () => void;
  delay?: number;
  deps?: DependencyList;
};

const useTimeout = ({ callback, cleanup, delay, deps = [] }: Props) => {
  useIsomorphicLayoutEffect(() => {
    const time = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(time);
      cleanup?.();
    };
  }, deps);

  return null;
};

export default useTimeout;
