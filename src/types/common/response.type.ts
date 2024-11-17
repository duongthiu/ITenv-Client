export interface ResponseAxios {
  success: boolean;
  message: string;
}

export type ResponsePagination<T> = {
  success: boolean;
  data: T | null;
  total?: number;
  error?: string;
  message?: string;
};
