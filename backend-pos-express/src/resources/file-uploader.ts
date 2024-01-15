import { Request, Response } from "express";
import responseSucces from "../responses/response-succes";
import multer from "multer";

export const uploader = multer({ dest: "./public/" });
export const uploaders = (req: Request, res: Response) => {
  if (!req.files) return;
  responseSucces(
    res,
    200,
    (req.files as Express.Multer.File[]).map((f) => {
      return {
        originalName: f.originalname,
        fileId: f.filename,
        mimeType: f.mimetype,
      };
    })
  );
};
