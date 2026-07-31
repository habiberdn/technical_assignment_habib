import { Request, Response, NextFunction } from "express";
import xss from "xss";

const sanitize = (data: any): any => {
  if (typeof data === "string") {
    return xss(data);
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item));
  }
  if (data !== null && typeof data === "object") {
    const sanitizedObj: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      sanitizedObj[key] = sanitize(data[key]);
    }
    return sanitizedObj;
  }
  return data;
};

export const xssSanitizer = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query && typeof req.query === "object") {
    const sanitizedQuery = sanitize(req.query);
    for (const key of Object.keys(sanitizedQuery)) {
      req.query[key] = sanitizedQuery[key];
    }
  }
  if (req.params && typeof req.params === "object") {
    const sanitizedParams = sanitize(req.params);
    for (const key of Object.keys(sanitizedParams)) {
      req.params[key] = sanitizedParams[key];
    }
  }
  next();
};
