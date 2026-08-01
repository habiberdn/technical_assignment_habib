import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 hari
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserRole = req.user?.role;
      const user = await authService.register(req.body, currentUserRole);
      return res.status(201).json({
        success: true,
        message: "Pengguna berhasil didaftarkan",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.cookie("token", result.token, COOKIE_OPTIONS);

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await authService.getProfile(userId);
      return res.status(200).json({
        success: true,
        message: "Profil pengguna berhasil diambil",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await authService.logout(userId);

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const poliId = req.query.poliId as string;
      const doctors = await authService.getDoctors(poliId);
      return res.status(200).json({
        success: true,
        message: "Daftar dokter berhasil diambil",
        data: doctors,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
