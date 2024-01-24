import { useEffect, useLayoutEffect } from 'react';

/**
 * @description serverside인 경우 useLayoutEffect에 대한 경고 메시지가 발생하는 이슈에 대하여
 * clientside인 경우 useLayoutEffect, serverside인 경우 useEffect를 사용하도록 하는 목적의 커스텀 훅
 */

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
