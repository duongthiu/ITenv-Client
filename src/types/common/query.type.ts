export type QueryOptions = {
  page?: number;
  search?: string;
  sortOrder?: 'DESC' | 'ASC' | 'desc' | 'asc';
  sortField?: string;
  pageSize?: number;
  year?: number;
};
