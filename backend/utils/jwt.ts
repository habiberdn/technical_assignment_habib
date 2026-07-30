import "dotenv/config";
import jwt from "jsonwebtoken";
import { Role } from "../dtos/auth.dto.js";

export interface TokenPayload {
  id: string;
  username: string;
  role: Role;
  poliId?: string | null;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET || "super_secret_jwt_key_maganghub_2026";
  return secret;
};

const getJwtExpiresIn = (): string => {
  return process.env.JWT_EXPIRES_IN || "1d";
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, getJwtSecret()) as TokenPayload;
};
