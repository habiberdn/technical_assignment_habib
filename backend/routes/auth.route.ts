import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "../dtos/auth.dto.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerUserSchema),
  authController.register
);

authRouter.post(
  "/login",
  validateRequest(loginUserSchema),
  authController.login
);

authRouter.get(
  "/me",
  authenticate,
  authController.getProfile
);

export default authRouter;
