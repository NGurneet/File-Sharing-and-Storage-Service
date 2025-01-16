interface IResponse {
  success: boolean;
  message?: string;
  data: object | null | any;
}

export type ErrorResponse = IResponse & {
  error_code: number;
};

export const createResponse = (
  data: IResponse["data"],
  message?: string
): IResponse => {
  return { data, message, success: true };
};

// export const createResponse = (
//   data: IResponse["data"],
//   message?: string
// ): IResponse => {
//   return { data, message, success: true }; // success is always true
// };


// Specific response for errors
export const createErrorResponse = (
  message: string,
  data: IResponse["data"] = null
): IResponse => {
  return { data, message, success: false };
};