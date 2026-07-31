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
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
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

authRouter.get(
  "/me",
  authenticate,
  authController.getProfile
);

export default authRouter;
