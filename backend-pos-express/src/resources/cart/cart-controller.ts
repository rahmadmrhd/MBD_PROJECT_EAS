import { NextFunction, Request, Response } from "express";
import cartServices from "./cart-services";
import responseSucces from "../../responses/response-succes";

namespace cartControllers {
  export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await cartServices.getAll(res);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await cartServices.create(req, res);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const update = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await cartServices.update(req, res);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const remove = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await cartServices.remove(req, res);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
}

export default cartControllers;
