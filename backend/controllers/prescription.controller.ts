import { Request, Response, NextFunction } from "express";
import { prescriptionService } from "../services/prescription.service.js";

export class PrescriptionController {
  async createPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.createPrescription(req.user!, req.body);
      return res.status(201).json({
        success: true,
        message: "Resep obat berhasil ditambahkan",
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPrescriptionById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const prescription = await prescriptionService.getPrescriptionById(id);
      return res.status(200).json({
        success: true,
        message: "Detail resep obat berhasil diambil",
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const prescriptionController = new PrescriptionController();
