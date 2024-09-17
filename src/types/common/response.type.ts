export interface ResponseAxios<T> {
  code: 'S' | 'E';
  message: string;
  data: T;
}

export type ResponsePagination<T> = {
  rows: T[];
  count: number;
};

export type ResponseListData<T> = ResponseAxios<ResponsePagination<T>>;
