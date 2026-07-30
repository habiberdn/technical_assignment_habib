import prisma from "../lib/prisma.ts";
import { RegisterUserDTO, LoginUserDTO } from "../dtos/auth.dto.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { HttpError } from "../middlewares/error.middleware.js";

export class AuthService {
  async register(data: RegisterUserDTO) {
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new HttpError(400, "Username sudah digunakan");
    }

    if (data.poliId) {
      const poliExists = await prisma.poli.findUnique({
        where: { id: data.poliId },
      });
      if (!poliExists) {
        throw new HttpError(404, "Poli tidak ditemukan");
      }
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        nama: data.nama,
        role: data.role,
        poliId: data.poliId || null,
      },
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        isActive: true,
        poliId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newUser;
  }

  async login(data: LoginUserDTO) {
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (!user) {
      throw new HttpError(401, "Username atau password salah");
    }

    if (!user.isActive) {
      throw new HttpError(403, "Akun pengguna tidak aktif");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, "Username atau password salah");
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      poliId: user.poliId,
    });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        isActive: true,
        poliId: true,
        poli: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new HttpError(404, "Pengguna tidak ditemukan");
    }

    return user;
  }
}

export const authService = new AuthService();
