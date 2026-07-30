import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
