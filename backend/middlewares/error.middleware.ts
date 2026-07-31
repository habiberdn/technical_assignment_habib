import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class HttpError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("[Error Handler]:", err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validasi data gagal",
      errors: formattedErrors,
    });
  }

  //Prisma Known Request Error (Konstrain Unik / Not Found)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "field terdaftar";
      return res.status(400).json({
        success: false,
        message: `Data dengan ${target} tersebut sudah terdaftar pada sistem`,
        errors: null,
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Data yang diminta tidak ditemukan di database",
        errors: null,
      });
    }
  }

  //Internal Server Error (Sanitasi di Production)
  const isProduction = process.env.NODE_ENV === "production";
  const errorMessage = isProduction
    ? "Terjadi kesalahan internal pada server"
    : err instanceof Error
    ? err.message
    : "Internal Server Error";

  return res.status(500).json({
    success: false,
    message: errorMessage,
  });
};
