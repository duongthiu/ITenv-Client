
import { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { ResponsePagination, QueryOptions } from '../../types/common';

interface PaginationResult<T> {
  data: ResponsePagination<T> | undefined;
  isLoading: boolean;
  isValidating: boolean;
  isError: boolean;
  isLoadMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reload: () => Promise<void>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fetcher<T, QueryOptions> = (query: QueryOptions) => Promise<ResponsePagination<T> | any>;

/**
 *
 * @param key The key of the fetcher SWR
 * @param query The object of QueryOptions (page, limit, offset,...)
 * @param fetcher The callback to fetch data from API
 * @param inverted If true, data return will be reverted
 * @returns {Object} The list data with pagination
 *  @property {boolean} isLoading: true if the api is fetching
 *  @property {boolean} isValidating: true if the api is validating
 *  @property {Object} data: The list data with pagination
 *  @property {boolean} isError: true if the api is error
 *  @property {boolean} isLoadMore: true if the api is load more
 *  @property {function} loadMore: This callback will be load more data
 *  @property {function} refresh: This callback will be refresh data
 *  @property {function} reload: This callback will be reload data
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function usePagination<T, QueryOptionsExtend = {}>(
  key: string,
  query: QueryOptions & QueryOptionsExtend,
  // eslint-disable-next-line @typescript-eslint/ban-types
  fetcher: Fetcher<T, QueryOptions & QueryOptionsExtend> | Function,
  inverted?: boolean
  // swrConfig?: SWRConfiguration<SWRResponse<ResponsePagination<T>>>,
): PaginationResult<T> {
  const [isLoadMore] = useState(false);

  const isFirstMount = useRef(true);

  const callback = useCallback(() => {
    return fetcher({ ...query });
  }, [JSON.stringify({ ...query })]);

  const { data, error, isValidating, isLoading, mutate } = useSWR(key, callback, {
    revalidateIfStale: true,
    revalidateOnFocus: false
  });

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
    } else {
      // mutate();
    }
    return () => {
      // mutate();
    };
  }, [JSON.stringify(query)]);

  /**
   * @remarks
   * This callback will be load more data
   * @see {@link http://example.com/@internal | the @internal tag}
   */
  const loadMore = useCallback(async () => {
    // if (data && data?.count < data?.totalDocs) {
    //   setIsLoadMore(true);
    //   const updateData = await fetcher({
    //     ...{...query,projectId:1},
    //     offset: data?.count || 0,
    //   });
    //   mutate(
    //     (prevData: ResponsePagination<T> | undefined) => {
    //       if (!prevData) {
    //         return undefined;
    //       }
    //       return {
    //         ...updateData,
    //         docs: inverted ? [...updateData.rows, ...prevData.rows] : [...prevData.rows, ...updateData.rows],
    //       };
    //     },
    //     { revalidate: false },
    //   );
    //   setIsLoadMore(false);
    // }
  }, [data, { ...query }, mutate, fetcher, inverted]);

  /**
   * This callback wile be refresh data
   */
  const refresh = useCallback(async () => {
    const updateData = await fetcher({
      ...query
    });
    mutate(updateData, { revalidate: false });
  }, [fetcher, mutate, JSON.stringify(query)]);

  /**
   * This callback wile be reload data
   */
  const reload = useCallback(async () => {
    // const updateData = await fetcher({ ...query });

    mutate();
  }, [fetcher, mutate, { ...query }]);

  return {
    data,
    isLoading: isLoading,
    isError: !!error,
    loadMore,
    isLoadMore,
    refresh,
    reload,
    isValidating
  };
}
