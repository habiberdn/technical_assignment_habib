import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Terlalu banyak permintaan dari IP ini. Silakan coba lagi dalam 15 menit.",
  },
});

// Rate limiter khusus rute sensitif seperti Auth (15 request per 15 menit per IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan autentikasi. Silakan coba lagi dalam 15 menit.",
  },
});
