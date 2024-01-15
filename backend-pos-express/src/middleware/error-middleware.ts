import { Request, Response, NextFunction } from "express";
import ResponseError from "../responses/response-error";
import logger from "../app/logging";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    return next();
  }
  if (err instanceof ResponseError) {
    // logger.error(`\"status\":${err.status}, \"message\":\"${err.message}`, err);
    res
      .status(err.status)
      .json({ status: err.status, message: err.message })
      .end();
  } else {
    // logger.error(`\"status\":${500}, \"message\":\"${err.message}`, err);
    res.status(500).json({ status: 500, message: err.message }).end();
  }
};

export default errorMiddleware;
