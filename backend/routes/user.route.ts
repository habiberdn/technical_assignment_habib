import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema, resetPasswordSchema } from "../dtos/user.dto.js";

const userRouter = Router();

// Semua rute user management dilindungi: Wajib Login & Wajib Role ADMIN
userRouter.use(authenticate, authorize("ADMIN"));

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getUserById);

userRouter.post(
  "/",
  validateRequest(createUserSchema),
  userController.createUser
);

userRouter.put(
  "/:id",
  validateRequest(updateUserSchema),
  userController.updateUser
);

userRouter.patch(
  "/:id/toggle-status",
  userController.toggleUserStatus
);

userRouter.patch(
  "/:id/reset-password",
  validateRequest(resetPasswordSchema),
  userController.resetPassword
);

export default userRouter;
