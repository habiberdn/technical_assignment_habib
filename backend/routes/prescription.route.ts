import { Router } from "express";
import { prescriptionController } from "../controllers/prescription.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const prescriptionRouter = Router();

prescriptionRouter.use(authenticate);

prescriptionRouter.post(
  "/",
  authorize("DOKTER", "ADMIN"),
  prescriptionController.createPrescription
);

prescriptionRouter.get(
  "/:id",
  authorize("DOKTER", "ADMIN", "PETUGAS_PENDAFTARAN"),
  prescriptionController.getPrescriptionById
);

export default prescriptionRouter;
