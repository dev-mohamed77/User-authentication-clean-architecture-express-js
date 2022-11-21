import { Request, Response, NextFunction } from "express";

export const error_handler = (
  err: BaseError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.httpStatusCode || 500;
  const message = err.description || "Something went wrong !";

  res.status(status).json({
    status: false,
    result: message,
  });
};

class BaseError extends Error {
  name: string;
  httpStatusCode: number;
  description: string;
  constructor(name: string, httpStatusCode: number, description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpStatusCode = httpStatusCode;
    this.description = description;

    Error.captureStackTrace(this);
  }
}

export class ApiError extends BaseError {
  constructor(name: string, httpStatusCode: number, description: string) {
    super(name, httpStatusCode, description);
  }
}
