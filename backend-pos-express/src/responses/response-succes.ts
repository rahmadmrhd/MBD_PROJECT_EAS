import { Response } from "express";

const responseSucces = (
  res: Response,
  status: number,
  data?: any,
  message?: string
) => {
  res.status(status).json({ status: status, message: message, data: data });
};

export default responseSucces;
