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
  let token: string | undefined;

  // 1. Cek token di HttpOnly Cookie (Utama untuk Web Frontend)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Cek token di Header Authorization Bearer (Untuk Postman / Mobile App)
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new HttpError(401, "Akses ditolak. Token tidak ditemukan di cookie maupun header"));
  }

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
