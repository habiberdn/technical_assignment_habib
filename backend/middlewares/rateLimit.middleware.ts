import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 100,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: () => isDev, // Skip rate limiting during local development & testing
  message: {
    success: false,
    message: "Terlalu banyak permintaan dari IP ini. Silakan coba lagi dalam 15 menit.",
  },
});

// Rate limiter khusus rute sensitif seperti Auth (15 request per 15 menit per IP di production)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 500 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev, // Skip rate limiting during local development & testing
  message: {
    success: false,
    message: "Terlalu banyak percobaan autentikasi. Silakan coba lagi dalam 15 menit.",
  },
});
