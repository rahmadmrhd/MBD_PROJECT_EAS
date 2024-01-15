import { NextFunction, Request, Response } from "express";
import responseSucces from "../../responses/response-succes";
import categoryServices from "./category-service";

namespace categoryControllers {
  export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await categoryServices.getAll();
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
      const result = await categoryServices.getById(req.params.id);
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
      const result = await categoryServices.create(req.body, res);
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
      const result = await categoryServices.update(req, res);
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
      const result = await categoryServices.createAndUpdate(req, res);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
}

export default categoryControllers;
