export type ResponseAxios<T> = {
  data: T | null;
  error?: {
    code: number;
    title?: string;
    message?: any;
  };
};
