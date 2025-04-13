export type ServiceResult<T> = {
  success: boolean;
  data: T | null;
  message: string;
};
