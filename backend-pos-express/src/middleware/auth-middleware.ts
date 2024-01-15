import { NextFunction, Request, Response } from "express";
import ResponseError from "../responses/response-error";
import db from "../app/database";
import Customer from "../resources/customer/customer-model";
import Employee from "../resources/employee/employee-model";

export const authCustomerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization")?.split(" ");
  if (!token || token?.length < 2) {
    return next("router");
  }
  if (token?.[0] != "Customer") {
    return next("router");
  }
  const [user] = await db.query<Customer[]>(
    "SELECT * FROM customer WHERE token = ?",
    [token?.[1]]
  );
  if (!user || user.length <= 0) {
    return next(new ResponseError(401, "Unauthorized"));
  }
  res.locals.customer = user[0];
  // console.log(res.locals.customer);
  next();
};

export const authEmployeeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization")?.split(" ");
  if (!token || token?.length < 2) {
    return next("router");
  }
  if (token?.[0] != "Employee") {
    return next("router");
  }
  const [user] = await db.query<Employee[]>(
    "SELECT * FROM employee WHERE token = ?",
    [token?.[1]]
  );
  if (!user || user.length <= 0) {
    return next(new ResponseError(401, "Unauthorized"));
  }
  res.locals.employee = user[0];
  // console.log(res.locals);
  next();
};
