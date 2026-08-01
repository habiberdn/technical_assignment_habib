import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getUsers({
        search: req.query.search as string,
        role: req.query.role as string,
        poliId: req.query.poliId as string,
        isActive: req.query.isActive as string,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await userService.getUserById(id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: "Akun staff baru berhasil dibuat",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updatedUser = await userService.updateUser(id, req.body);
      res.status(200).json({
        success: true,
        message: "Data staff berhasil diperbarui",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const currentUserId = req.user?.id || "";
      const updated = await userService.toggleUserStatus(id, currentUserId);
      const statusText = updated.isActive ? "diaktifkan" : "dinonaktifkan";

      res.status(200).json({
        success: true,
        message: `Akun ${updated.nama} (${updated.username}) berhasil ${statusText}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await userService.resetPassword(id, req.body);
      res.status(200).json({
        success: true,
        message: "Kata sandi staff berhasil diperbarui",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
