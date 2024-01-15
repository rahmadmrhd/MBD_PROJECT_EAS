import { NextFunction, Request, Response } from "express";
import voucherServices from "./voucher-services";
import responseSucces from "../../responses/response-succes";

namespace voucherControllers {
  export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await voucherServices.getAll(req);
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
      const result = await voucherServices.getById(req.params.id);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const getByCode = async (
    req: Request<{ code: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await voucherServices.getByCode(req.params.code, res);
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
      const result = await voucherServices.create(req.body, res);
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
      const result = await voucherServices.update(req, res);
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
      const result = await voucherServices.remove(req);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
}

export default voucherControllers;
