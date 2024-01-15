import { NextFunction, Request, Response } from "express";
import reservationServices from "./reservation-services";
import responseSucces from "../../responses/response-succes";

namespace reservationControllers {
  export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await reservationServices.getAll(req);
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
      const result = await reservationServices.getById(req.params.id);
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
      const result = await reservationServices.getAllInCustomer(req, res);
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
      const result = await reservationServices.getAllWaitingList(req);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const createFromCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await reservationServices.createFromCustomer(
        req.body,
        res
      );
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const createFromEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await reservationServices.createFromEmployee(
        req.body,
        res
      );
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
      const result = await reservationServices.updateFromCustomer(req, res);
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
      const result = await reservationServices.updateFromEmployee(req, res);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
}

export default reservationControllers;
