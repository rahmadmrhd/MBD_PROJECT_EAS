import { NextFunction, Request, Response } from "express";
import orderServices from "./order-services";
import responseSucces from "../../responses/response-succes";

namespace orderControllers {
  export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await orderServices.getAll(req);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const getAllInCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await orderServices.getAllInCustomer(req, res);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const getAllWaitingList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await orderServices.getAllWaitingList(req);
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
      const result = await orderServices.getById(req.params.id);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const getByIdFromCustomer = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await orderServices.getByIdFromCustomer(req.params.id);

      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const getByIdDetails = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await orderServices.getByIdDetails(req.params.id);

      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const rateOrder = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await orderServices.rateOrder(req);

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
      const result = await orderServices.create(req, res);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const updateFromCustomer = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await orderServices.updateFromCustomer(req, res);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
  export const updateFromEmployee = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await orderServices.updateFromEmployee(req, res);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
}

export default orderControllers;
