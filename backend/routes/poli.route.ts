import { Router } from "express";
import { poliController } from "../controllers/poli.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { createPoliSchema, updatePoliSchema } from "../dtos/poli.dto.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const poliRouter = Router();

poliRouter.use(authenticate);

poliRouter.get(
  "/",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  poliController.getAllPoli
);

poliRouter.get(
  "/:id",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  poliController.getPoliById
);

poliRouter.post(
  "/",
  authorize("ADMIN"),
  validateRequest(createPoliSchema),
  poliController.createPoli
);

poliRouter.put(
  "/:id",
  authorize("ADMIN"),
  validateRequest(updatePoliSchema),
  poliController.updatePoli
);

poliRouter.delete(
  "/:id",
  authorize("ADMIN"),
  poliController.deletePoli
);

export default poliRouter;
