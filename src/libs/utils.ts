import qs from "qs";

/**
 * @description 주소길이 줄이기
 * @param account wallet account address
 * @param startIndex 시작 위치
 * @param endIndex 마지막 위치
 */
export const convertAddress = (
  account: string,
  startIndex?: number,
  endIndex?: number
): string =>
  `${account.substring(0, startIndex || 10)}...${account.substring(
    endIndex || 32
  )}`;

/**
 * @description breakpoint의 미디어 쿼리 조건만 반환합니다(useMedia에서 사용)
 * @param mediaQuery 미디어 쿼리
 */
export const getBreakpointQuery = (mediaQuery: string): string => {
  return mediaQuery.replace(/@media /, "");
};

/**
 * @description 1,000단위 콤마
 * @param num
 */
export const setComma = (num: number): string =>
  num.toLocaleString(undefined, { maximumFractionDigits: 4 });

/**
 * @description 넘겨받은 문자열을 PascalCase로 변환해줍니다.
 * @param value
 */
export const convertPascalCase = (value: string) =>
  value
    ? value.replace(/\w+/g, (word) => {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      })
    : "";

/**
 * @description sign message 생성
 * @param message message
 */
export const getSignMessage = (message: string): string =>
  `0x${Buffer.from(message).toString("hex")}`;

/**
 * @description 배열 a,b가 같은 배열인지 아닌지 결정합니다
 * @param a 배열a
 * @param b 배열b
 */
export const isDifferentArray = (a: unknown[] = [], b: unknown[] = []) => {
  return (
    a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]))
  );
};

/**
 * @description 객체에 포함된 값들을 url에 query로 변경합니다 ex) a={a}&b={b}
 * @param param object
 * @returns string
 */
export const queryStringify = (param: object) =>
  qs.stringify(param, { skipNulls: true });

export const parsePaginationData = (data: any) =>
  data?.reduce((prev: any, cur: any) => {
    return [...prev, ...(cur?.data ?? [])];
  }, []);

export const isMain = () => {
  const { pathname, search } = window.location;

  return (
    (pathname === "/" && (search.includes("?type=main") || !search)) ||
    pathname === "/"
  );
};

export const delay = (callback: () => any, time?: number) => {
  setTimeout(callback, time ?? 1000);
};
