import prisma from "../lib/prisma.js";
import { RegisterUserDTO, LoginUserDTO } from "../dtos/auth.dto.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { HttpError } from "../middlewares/error.middleware.js";

export class AuthService {
  async register(data: RegisterUserDTO, currentUserRole?: string) {
    const totalUsers = await prisma.user.count();

    // Jika sudah ada user di sistem, registrasi baru WAJIB dilakukan oleh ADMIN
    if (totalUsers > 0 && currentUserRole !== "ADMIN") {
      throw new HttpError(
        403,
        "Akses ditolak. Hanya Administrator yang dapat mendaftarkan pengguna baru"
      );
    }

    if (totalUsers > 0 && data.role === "ADMIN") {
      throw new HttpError(
        400,
        "Role Administrator tidak dapat dibuat secara bebas. Hanya DOKTER atau PETUGAS PENDAFTARAN yang dapat ditambahkan."
      );
    }

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

    if (data.role === "DOKTER" && !data.poliId) {
      throw new HttpError(400, "Pengguna dengan role DOKTER wajib memilih Poli tempat bertugas");
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

  async logout(userId: string) {
    await this.getProfile(userId);
    return {
      message: "Logout berhasil. Silakan hapus token di sisi klien",
    };
  }

  async getDoctors(poliId?: string) {
    const where: any = { role: "DOKTER", isActive: true };
    if (poliId) where.poliId = poliId;
    return prisma.user.findMany({
      where,
      select: {
        id: true,
        nama: true,
        username: true,
        poliId: true,
        poli: { select: { id: true, kode: true, nama: true } },
      },
      orderBy: { nama: "asc" },
    });
  }
}

export const authService = new AuthService();
