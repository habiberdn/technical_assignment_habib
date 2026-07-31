import { Router } from "express";
import { pemeriksaanController } from "../controllers/pemeriksaan.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { createPemeriksaanSchema, updatePemeriksaanSchema } from "../dtos/pemeriksaan.dto.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const pemeriksaanRouter = Router();

pemeriksaanRouter.use(authenticate);

pemeriksaanRouter.post(
  "/",
  authorize("DOKTER", "ADMIN"),
  validateRequest(createPemeriksaanSchema),
  pemeriksaanController.createPemeriksaan
);

// PENTING: Route khusus /pasien/:pasienId HARUS dideklarasikan SEBELUM route dinamis /:id
pemeriksaanRouter.get(
  "/pasien/:pasienId",
  authorize("DOKTER", "ADMIN", "PETUGAS_PENDAFTARAN"),
  pemeriksaanController.getRiwayatPemeriksaanPasien
);

pemeriksaanRouter.get(
  "/:id",
  authorize("DOKTER", "ADMIN", "PETUGAS_PENDAFTARAN"),
  pemeriksaanController.getPemeriksaanById
);

pemeriksaanRouter.put(
  "/:id",
  authorize("DOKTER", "ADMIN"),
  validateRequest(updatePemeriksaanSchema),
  pemeriksaanController.updatePemeriksaan
);

export default pemeriksaanRouter;
