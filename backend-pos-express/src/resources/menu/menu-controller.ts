import { NextFunction, Request, Response } from "express";
import menuServices from "./menu-services";
import responseSucces from "../../responses/response-succes";

namespace menuControllers {
  export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await menuServices.getAll(req);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const getAllFromCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await menuServices.getAllFromCustomer(req, res);
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
      const result = await menuServices.getById(req.params.id);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const getRateById = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await menuServices.getRateById(req.params.id);
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
      const result = await menuServices.create(req.body, res);
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
      const result = await menuServices.update(req, res);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
  export const remove = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await menuServices.remove(req);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
  export const setFavorite = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await menuServices.setFavorite(req, res);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
}

export default menuControllers;
