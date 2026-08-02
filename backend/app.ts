import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import poliRouter from "./routes/poli.route.js";
import pasienRouter from "./routes/pasien.route.js";
import registrasiRouter from "./routes/registrasi.route.js";
import pemeriksaanRouter from "./routes/pemeriksaan.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import userRouter from "./routes/user.route.js";
import prescriptionRouter from "./routes/prescription.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";
import { xssSanitizer } from "./middlewares/xss.middleware.js";

const app = express();

// Security HTTP Headers
app.use(helmet());

// CORS Policy dengan dukungan Cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

// Cookie Parser Middleware
app.use(cookieParser());

// Rate Limiting
app.use("/api", generalLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(hpp());

app.use(xssSanitizer);

app.use("/login", authRouter);
app.use("/logout", authRouter);
app.use("/api/auth", authRouter);
app.use("/api/login", authRouter);
app.use("/api/logout", authRouter);

app.use("/poli", poliRouter);
app.use("/api/poli", poliRouter);

app.use("/patients", pasienRouter);
app.use("/pasien", pasienRouter);
app.use("/api/pasien", pasienRouter);
app.use("/api/patients", pasienRouter);

app.use("/registrations", registrasiRouter);
app.use("/queues", registrasiRouter);
app.use("/registrasi", registrasiRouter);
app.use("/api/registrasi", registrasiRouter);
app.use("/api/registrations", registrasiRouter);
app.use("/api/queues", registrasiRouter);

app.use("/medical-records", pemeriksaanRouter);
app.use("/pemeriksaan", pemeriksaanRouter);
app.use("/api/pemeriksaan", pemeriksaanRouter);
app.use("/api/medical-records", pemeriksaanRouter);

app.use("/prescriptions", prescriptionRouter);
app.use("/resep", prescriptionRouter);
app.use("/api/prescriptions", prescriptionRouter);
app.use("/api/resep", prescriptionRouter);

app.use("/dashboard", dashboardRouter);
app.use("/users", userRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/users", userRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
