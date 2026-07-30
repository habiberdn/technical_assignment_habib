import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.js";
import { HttpError } from "./error.middleware.js";
import { Role } from "../dtos/auth.dto.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Akses ditolak. Token tidak ditemukan"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new HttpError(401, "Token tidak valid atau telah kadaluwarsa"));
  }
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Pengguna tidak terotentikasi"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new HttpError(
          403,
          `Akses ditolak. Role '${req.user.role}' tidak memiliki izin untuk mengakses resource ini`
        )
      );
    }

    next();
  };
};
