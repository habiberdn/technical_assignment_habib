import { Router } from "express";
import { pasienController } from "../controllers/pasien.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { createPasienSchema, updatePasienSchema } from "../dtos/pasien.dto.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const pasienRouter = Router();

pasienRouter.use(authenticate);

pasienRouter.get(
  "/",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  pasienController.getPasienList
);

pasienRouter.get(
  "/:id",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  pasienController.getPasienById
);

pasienRouter.post(
  "/",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN"),
  validateRequest(createPasienSchema),
  pasienController.createPasien
);

pasienRouter.put(
  "/:id",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN"),
  validateRequest(updatePasienSchema),
  pasienController.updatePasien
);

pasienRouter.delete(
  "/:id",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN"),
  pasienController.deletePasien
);

export default pasienRouter;
