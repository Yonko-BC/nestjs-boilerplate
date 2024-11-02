export interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error: string;
  operation: string;
  message: string;
  cosmosErrorCode?: number;
  httpStatus: number;
  details?: string;
  requestId?: string;
}
