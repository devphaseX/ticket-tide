import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import StatusCodes from "http-status";

type ApiBaseResponse = {
  success: boolean;
  message?: string;
};

export type ApiSuccessResponse<Data = unknown> = {
  success: true;
} & ApiBaseResponse &
  Data;

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors: Record<string, unknown> | Error;
} & ApiBaseResponse;

export function successResponse<Data = unknown>(
  c: Context,
  data?: Data,
  code?: StatusCode,
  message?: string,
) {
  return c.json(
    <ApiSuccessResponse<Data>>{ success: true, message, ...data },
    code ?? StatusCodes.OK,
  );
}

export function errorResponse(
  c: Context,
  message: string,
  errors?: Record<string, unknown> | Error,
) {
  return c.json(<ApiErrorResponse>{ success: false, message, errors });
}
