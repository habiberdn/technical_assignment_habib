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

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/poli", poliRouter);
app.use("/api/pasien", pasienRouter);
app.use("/api/registrasi", registrasiRouter);
app.use("/api/pemeriksaan", pemeriksaanRouter);
app.use("/api/dashboard", dashboardRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
