import { NextFunction, Request, Response } from "express";
import responseSucces from "../../responses/response-succes";
import employeeServices from "./employee-service";
import ResponseError from "../../responses/response-error";

namespace employeeControllers {
  export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await employeeServices.register(req);
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
      const result = await employeeServices.update(
        req,
        res.locals.employee.username
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
      const result = await employeeServices.login(req);
      res.cookie("token", result.token, {
        maxAge: 1000 * 60 * 60 * 24,
      });
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
    try {
      const result = await employeeServices.get(res.locals.employee.username);
      responseSucces(res, 200, result);
    } catch (e: any) {
      next(e);
    }
  };

  export const verify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await employeeServices.verify(req, res);
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
      const result = await employeeServices.logout(
        res.locals.employee.username
      );
      if (!result) {
        throw new ResponseError(400, "Logout failed");
      }
      res.clearCookie("token");
      responseSucces(res, 200, null, "Logout success");
    } catch (e: any) {
      next(e);
    }
  };
}
export default employeeControllers;
