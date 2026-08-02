import { Request, Response, NextFunction } from "express";
import { registrasiService } from "../services/registrasi.service.js";

export class RegistrasiController {
  async createRegistrasi(req: Request, res: Response, next: NextFunction) {
    try {
      const petugasId = req.user!.id;
      const registrasi = await registrasiService.createRegistrasi(petugasId, req.body);
      return res.status(201).json({
        success: true,
        message: "Pendaftaran pasien dan nomor antrean berhasil dibuat",
        data: registrasi,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrasiList(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await registrasiService.getRegistrasiList({
        tanggalKunjungan: req.query.tanggalKunjungan as string,
        poliId: req.query.poliId as string,
        dokterId: req.query.dokterId as string,
        status: req.query.status as string,
        statusAntrean: req.query.statusAntrean as string,
        search: req.query.search as string,
      });

      return res.status(200).json({
        success: true,
        message: "Daftar registrasi/antrean berhasil diambil",
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrasiById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const registrasi = await registrasiService.getRegistrasiById(id);
      return res.status(200).json({
        success: true,
        message: "Detail registrasi/antrean berhasil diambil",
        data: registrasi,
      });
    } catch (error) {
      next(error);
    }
  }

  async panggilAntrean(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const registrasi = await registrasiService.panggilAntrean(id, req.user!);
      return res.status(200).json({
        success: true,
        message: `Antrean '${registrasi.nomorAntrean}' dipanggil`,
        data: registrasi,
      });
    } catch (error) {
      next(error);
    }
  }

  async panggilNextAntrean(req: Request, res: Response, next: NextFunction) {
    try {
      const poliId = req.query.poliId as string | undefined;
      const dokterId = req.query.dokterId as string | undefined;
      const registrasi = await registrasiService.panggilNextAntrean(req.user!, poliId, dokterId);
      return res.status(200).json({
        success: true,
        message: `Antrean berikutnya '${registrasi.nomorAntrean}' berhasil dipanggil`,
        data: registrasi,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const registrasi = await registrasiService.updateStatus(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Status registrasi/antrean berhasil diperbarui",
        data: registrasi,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const registrasiController = new RegistrasiController();
