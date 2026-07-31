import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get(
  "/stats",
  authorize("ADMIN", "PETUGAS_PENDAFTARAN", "DOKTER"),
  dashboardController.getStats
);

export default dashboardRouter;
