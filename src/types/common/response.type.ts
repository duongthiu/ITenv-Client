export interface ResponseAxios<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ResponsePagination<T> = {
  success: boolean;
  data: T | null;
  total?: number;
  error?: string;
};

export type ResponseListData<T> = ResponseAxios<ResponsePagination<T>>;
