import { z } from "zod";
import { Role } from "@prisma/client";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username hanya boleh berisi huruf, angka, titik, underscore, dan dash"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  nama: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  role: z.nativeEnum(Role, {
    message: "Role tidak valid (ADMIN, DOKTER, PETUGAS_PENDAFTARAN)",
  }),
  poliId: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
}).refine(
  (data) => {
    if (data.role === Role.DOKTER) {
      return !!data.poliId;
    }
    return true;
  },
  {
    message: "Pengguna dengan role DOKTER wajib memilih Poliklinik tempat bertugas",
    path: ["poliId"],
  }
);

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username hanya boleh berisi huruf, angka, titik, underscore, dan dash")
    .optional(),
  password: z.string().min(6, "Kata sandi minimal 6 karakter").optional().or(z.literal("")),
  nama: z.string().min(2, "Nama lengkap minimal 2 karakter").optional(),
  role: z.nativeEnum(Role).optional(),
  poliId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter"),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
