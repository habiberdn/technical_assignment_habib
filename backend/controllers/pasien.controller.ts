import { Request, Response, NextFunction } from "express";
import { pasienService } from "../services/pasien.service.js";

export class PasienController {
  async createPasien(req: Request, res: Response, next: NextFunction) {
    try {
      const pasien = await pasienService.createPasien(req.body);
      return res.status(201).json({
        success: true,
        message: "Data pasien berhasil ditambahkan",
        data: pasien,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPasienList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await pasienService.getPasienList({
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Daftar pasien berhasil diambil",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPasienById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const pasien = await pasienService.getPasienById(id);
      return res.status(200).json({
        success: true,
        message: "Detail pasien berhasil diambil",
        data: pasien,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePasien(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const pasien = await pasienService.updatePasien(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Data pasien berhasil diperbarui",
        data: pasien,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePasien(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await pasienService.deletePasien(id);
      return res.status(200).json({
        success: true,
        message: "Data pasien berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const pasienController = new PasienController();
