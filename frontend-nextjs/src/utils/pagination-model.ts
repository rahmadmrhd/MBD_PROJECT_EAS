export type PaginationModel<T> = {
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  rows?: T[];
};
