import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service.js";

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getStats(req.user);
      return res.status(200).json({
        success: true,
        message: "Statistik dashboard berhasil diambil",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
