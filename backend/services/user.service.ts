import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { HttpError } from "../middlewares/error.middleware.js";
import type { CreateUserDTO, UpdateUserDTO, ResetPasswordDTO } from "../dtos/user.dto.js";

export class UserService {
  async getUsers(query: {
    search?: string;
    role?: string;
    poliId?: string;
    isActive?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { nama: { contains: q, mode: "insensitive" } },
        { username: { contains: q, mode: "insensitive" } },
      ];
    }

    if (query.role && query.role !== "all") {
      where.role = query.role;
    }

    if (query.poliId && query.poliId !== "all") {
      where.poliId = query.poliId;
    }

    if (query.isActive !== undefined && query.isActive !== "all") {
      where.isActive = query.isActive === "true";
    }

    const [totalData, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          nama: true,
          role: true,
          isActive: true,
          poliId: true,
          createdAt: true,
          updatedAt: true,
          poli: {
            select: {
              id: true,
              kode: true,
              nama: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return {
      data: users,
      meta: {
        total: totalData,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        isActive: true,
        poliId: true,
        createdAt: true,
        updatedAt: true,
        poli: {
          select: {
            id: true,
            kode: true,
            nama: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpError(404, "Pengguna / Staff tidak ditemukan");
    }

    return user;
  }

  async createUser(data: CreateUserDTO) {
    if (data.role === Role.ADMIN) {
      throw new HttpError(400, "Role Administrator tidak dapat dibuat melalui menu Kelola Staff. Hanya DOKTER atau PETUGAS PENDAFTARAN yang dapat ditambahkan.");
    }

    const existing = await prisma.user.findUnique({
      where: { username: data.username.toLowerCase() },
    });

    if (existing) {
      throw new HttpError(400, `Username '${data.username}' sudah digunakan.`);
    }

    if (data.poliId) {
      const poliExists = await prisma.poli.findUnique({
        where: { id: data.poliId },
      });
      if (!poliExists) {
        throw new HttpError(404, "Poliklinik yang dipilih tidak ditemukan");
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: data.username.toLowerCase(),
        password: hashedPassword,
        nama: data.nama,
        role: data.role,
        poliId: data.poliId || null,
        isActive: data.isActive ?? true,
      },
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        isActive: true,
        poliId: true,
        createdAt: true,
        poli: {
          select: {
            id: true,
            kode: true,
            nama: true,
          },
        },
      },
    });

    return newUser;
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    const targetUser = await this.getUserById(id);

    if (data.username && data.username.toLowerCase() !== targetUser.username) {
      const existing = await prisma.user.findUnique({
        where: { username: data.username.toLowerCase() },
      });
      if (existing) {
        throw new HttpError(400, `Username '${data.username}' sudah digunakan.`);
      }
    }

    if (data.poliId) {
      const poliExists = await prisma.poli.findUnique({
        where: { id: data.poliId },
      });
      if (!poliExists) {
        throw new HttpError(404, "Poliklinik yang dipilih tidak ditemukan");
      }
    }

    const updateData: any = {};
    if (data.username) updateData.username = data.username.toLowerCase();
    if (data.nama) updateData.nama = data.nama;
    if (data.role) updateData.role = data.role;
    if (data.poliId !== undefined) updateData.poliId = data.poliId || null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.password && data.password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        isActive: true,
        poliId: true,
        createdAt: true,
        updatedAt: true,
        poli: {
          select: {
            id: true,
            kode: true,
            nama: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async toggleUserStatus(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new HttpError(400, "Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang digunakan");
    }

    const user = await this.getUserById(id);
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        isActive: true,
      },
    });

    return updated;
  }

  async resetPassword(id: string, data: ResetPasswordDTO) {
    await this.getUserById(id);

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: "Kata sandi berhasil diperbarui" };
  }
}

export const userService = new UserService();
