import { z } from "zod";

export const createUserFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username hanya boleh berupa huruf, angka, titik, _, dan -"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  nama: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  role: z.enum(["DOKTER", "PETUGAS_PENDAFTARAN"], {
    message: "Pilih role staff yang valid (DOKTER atau PETUGAS PENDAFTARAN)",
  }),
  poliId: z.string().optional(),
  isActive: z.boolean().default(true),
}).refine(
  (data) => {
    if (data.role === "DOKTER") {
      return !!data.poliId && data.poliId.trim() !== "";
    }
    return true;
  },
  {
    message: "Pengguna dengan role DOKTER wajib memilih Poliklinik tempat bertugas",
    path: ["poliId"],
  }
);

export const updateUserFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username hanya boleh berupa huruf, angka, titik, _, dan -"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter").optional().or(z.literal("")),
  nama: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  role: z.enum(["ADMIN", "DOKTER", "PETUGAS_PENDAFTARAN"]),
  poliId: z.string().optional(),
  isActive: z.boolean(),
}).refine(
  (data) => {
    if (data.role === "DOKTER") {
      return !!data.poliId && data.poliId.trim() !== "";
    }
    return true;
  },
  {
    message: "Pengguna dengan role DOKTER wajib memilih Poliklinik tempat bertugas",
    path: ["poliId"],
  }
);

export const resetPasswordFormSchema = z.object({
  newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi kata sandi minimal 6 karakter"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru",
  path: ["confirmPassword"],
});

export type CreateUserFormDTO = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormDTO = z.infer<typeof updateUserFormSchema>;
export type ResetPasswordFormDTO = z.infer<typeof resetPasswordFormSchema>;
