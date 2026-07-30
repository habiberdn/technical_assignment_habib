import jwt from "jsonwebtoken";
import { Role } from "../dtos/auth.dto.js";

export interface TokenPayload {
  id: string;
  username: string;
  role: Role;
  poliId?: string | null;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET tidak ditemukan di variabel lingkungan (.env)");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
