import { NextFunction, Request, Response } from "express";
import responseSucces from "../../responses/response-succes";
import tableServices from "./table-service";

namespace tableControllers {
  export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await tableServices.getAll();
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const getById = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await tableServices.getById(req.params.id);
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
      const result = await tableServices.create(req.body, res);
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
      const result = await tableServices.update(req, res);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
  export const createAndUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await tableServices.createAndUpdate(req, res);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
}

export default tableControllers;
