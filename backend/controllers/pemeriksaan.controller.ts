import { Request, Response, NextFunction } from "express";
import { pemeriksaanService } from "../services/pemeriksaan.service.js";

export class PemeriksaanController {
  async createPemeriksaan(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = { id: req.user!.id, role: req.user!.role };
      const pemeriksaan = await pemeriksaanService.createPemeriksaan(currentUser, req.body);
      return res.status(201).json({
        success: true,
        message: "Data pemeriksaan medis berhasil disimpan",
        data: pemeriksaan,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPemeriksaanById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const pemeriksaan = await pemeriksaanService.getPemeriksaanById(id);
      return res.status(200).json({
        success: true,
        message: "Detail pemeriksaan medis berhasil diambil",
        data: pemeriksaan,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePemeriksaan(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const currentUser = { id: req.user!.id, role: req.user!.role };
      const pemeriksaan = await pemeriksaanService.updatePemeriksaan(currentUser, id, req.body);
      return res.status(200).json({
        success: true,
        message: "Data pemeriksaan medis berhasil diperbarui",
        data: pemeriksaan,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRiwayatPemeriksaanPasien(req: Request, res: Response, next: NextFunction) {
    try {
      const pasienId = String(req.params.pasienId || req.params.patientId);
      const result = await pemeriksaanService.getRiwayatPemeriksaanPasien(pasienId);
      return res.status(200).json({
        success: true,
        message: "Riwayat pemeriksaan pasien berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const pemeriksaanController = new PemeriksaanController();
