import { z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "DOKTER", "PETUGAS_PENDAFTARAN"]);
export type Role = z.infer<typeof RoleEnum>;

export const registerUserSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter").max(50),
  password: z.string().min(6, "Password minimal 6 karakter"),
  nama: z.string().min(1, "Nama wajib diisi"),
  role: RoleEnum,
  poliId: z.string().optional().nullable(),
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
