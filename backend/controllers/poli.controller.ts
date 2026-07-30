import { Request, Response, NextFunction } from "express";
import { poliService } from "../services/poli.service.js";

export class PoliController {
  async createPoli(req: Request, res: Response, next: NextFunction) {
    try {
      const poli = await poliService.createPoli(req.body);
      return res.status(201).json({
        success: true,
        message: "Poli berhasil ditambahkan",
        data: poli,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPoli(_req: Request, res: Response, next: NextFunction) {
    try {
      const poliList = await poliService.getAllPoli();
      return res.status(200).json({
        success: true,
        message: "Daftar poli berhasil diambil",
        data: poliList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPoliById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const poli = await poliService.getPoliById(id);
      return res.status(200).json({
        success: true,
        message: "Detail poli berhasil diambil",
        data: poli,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePoli(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const poli = await poliService.updatePoli(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Data poli berhasil diperbarui",
        data: poli,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePoli(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await poliService.deletePoli(id);
      return res.status(200).json({
        success: true,
        message: "Poli berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const poliController = new PoliController();
