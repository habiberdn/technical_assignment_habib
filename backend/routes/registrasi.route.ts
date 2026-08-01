import { Router } from "express";
import { registrasiController } from "../controllers/registrasi.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { createRegistrasiSchema, updateStatusRegistrasiSchema } from "../dtos/registrasi.dto.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const registrasiRouter = Router();

// Semua rute Registrasi membutuhkan autentikasi JWT
registrasiRouter.use(authenticate);

registrasiRouter.get(
  "/",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  registrasiController.getRegistrasiList
);

// PENTING: Route khusus /panggil-next HARUS ditaruh sebelum route dinamis /:id
registrasiRouter.patch(
  "/panggil-next",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  registrasiController.panggilNextAntrean
);

registrasiRouter.get(
  "/:id",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  registrasiController.getRegistrasiById
);

registrasiRouter.post(
  "/",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN"),
  validateRequest(createRegistrasiSchema),
  registrasiController.createRegistrasi
);

registrasiRouter.patch(
  "/:id/panggil",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  registrasiController.panggilAntrean
);

registrasiRouter.patch(
  "/:id/status",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  validateRequest(updateStatusRegistrasiSchema),
  registrasiController.updateStatus
);

export default registrasiRouter;
