import { NextFunction, Request, Response } from "express";
import ResponseError from "../responses/response-error";

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next(new ResponseError(404, `Not Found - ${req.originalUrl}`));
};

export default notFoundMiddleware;
