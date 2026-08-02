import { Router, Request, Response, NextFunction } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "../dtos/auth.dto.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
import { verifyToken } from "../utils/jwt.js";

const authRouter = Router();

// Middleware opsional untuk mendeteksi token jika ada pada route register
const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction) => {
  let token: string | undefined;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // Abaikan jika token invalid
    }
  }
  next();
};

authRouter.post(
  "/register",
  authLimiter,
  optionalAuthenticate,
  validateRequest(registerUserSchema),
  authController.register
);

authRouter.post(
  "/login",
  authLimiter,
  validateRequest(loginUserSchema),
  authController.login
);

authRouter.post(
  "/logout",
  authenticate,
  authController.logout
);

authRouter.post(
  "/",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.baseUrl.endsWith("/login")) {
      return validateRequest(loginUserSchema)(req, res, () => authController.login(req, res, next));
    }
    if (req.baseUrl.endsWith("/logout")) {
      return authenticate(req, res, () => authController.logout(req, res, next));
    }
    next();
  }
);

authRouter.get(
  "/me",
  authenticate,
  authController.getProfile
);

authRouter.get(
  "/doctors",
  authenticate,
  authController.getDoctors
);

export default authRouter;
