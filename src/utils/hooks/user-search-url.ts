import { useSearchParams } from 'react-router-dom';
import { QueryOptions } from '../../types/common';
type UnionQueryOptions = keyof QueryOptions;

type ReturnUseSearchURL<T> = {
  searchParams: QueryOptions & T;
  updateSearchParams: (params: Partial<QueryOptions & T>) => void;
  getParamSearch: <TypeValue = string>(name: UnionQueryOptions) => TypeValue | null;
  getParamFollowQueryOptions: (names: UnionQueryOptions[]) => QueryOptions;
};

/**
 *
 * @param page The object of QueryOptions (page, limit, offset,...)
 * @param pageSize The object of QueryOptions (page, limit, offset,...)
 * @returns {Object} The list data with search url
 *  @property {object} searchParams: The object of QueryOptions (page, limit, offset,...)
 *  @property {function} updateSearchParams: This callback will update search parameters
 *  @property {function} getParamSearch: This callback will get param follow name
 *  @property {function} getParamFollowQueryOptions: This callback will get param follow query options
 */
const useSearchURL = <QueryOptionsExtend>({
  page = 1,
  pageSize: pageSize = 12
}: QueryOptions & QueryOptionsExtend): ReturnUseSearchURL<QueryOptionsExtend> => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });

  const removeEmptyFields = (obj: Partial<QueryOptions & QueryOptionsExtend>) => {
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(obj).filter(([_, value]) => {
        return value !== null && value !== undefined && value !== '';
      })
    );
  };

  const updateSearchParams = (params: Partial<QueryOptions & QueryOptionsExtend>) => {
    const filteredParams = removeEmptyFields(params);
    setSearchParams((prev) => {
      return {
        ...prev,
        ...filteredParams
      };
    });
  };

  const getParamSearch = <T = string>(name: UnionQueryOptions) => {
    return searchParams.get(name) as T;
  };

  const getParamFollowQueryOptions = (names: UnionQueryOptions[]): QueryOptions => {
    const result: any = {};
    names.forEach((name: UnionQueryOptions) => {
      result[name] = searchParams.get(name);
    });
    return result as QueryOptions;
  };

  return {
    searchParams: searchParams as unknown as QueryOptions & QueryOptionsExtend,
    updateSearchParams,
    getParamSearch,
    getParamFollowQueryOptions
  };
};
export default useSearchURL;
