export type ErrorType = {
  code: number;
  title?: string;
  message?: string;
};

export const ErrorToString = (error: ErrorType) => {
  return `${error.code}${"|" + error.title}${"|" + error.message}`;
};

export const isError = (error: any): error is ErrorType => {
  if (error == null || error == undefined) return false;
  return "code" in error;
};
