import { NextFunction, Request, Response } from "express";
import responseSucces from "../../responses/response-succes";
import customerServices from "./customer-service";
import ResponseError from "../../responses/response-error";

namespace customerControllers {
  export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await customerServices.register(req);
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
  export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await customerServices.update(
        req,
        res.locals.customer.username
      );
      responseSucces(res, 200, result);
    } catch (error: any) {
      next(error);
    }
  };
  export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await customerServices.login(req);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // console.log(res.locals.customer);
    try {
      const result = await customerServices.get(res.locals.customer.username);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // console.log(res.locals.customer);
    try {
      const result = await customerServices.verifyToken(
        res.locals.customer.token
      );
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };
  export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await customerServices.logout(
        res.locals.customer.username
      );
      if (!result) {
        throw new ResponseError(400, "Logout failed");
      }
      responseSucces(res, 200, null, "Logout success");
    } catch (e: any) {
      next(e);
    }
  };
}
export default customerControllers;
