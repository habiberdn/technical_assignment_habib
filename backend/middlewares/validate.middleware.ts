import { Request, Response, NextFunction } from "express";
import { z} from "zod";
export const validateRequest = (schema: z.ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
