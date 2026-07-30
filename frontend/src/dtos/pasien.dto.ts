import { z } from "zod";

export const JenisKelaminEnum = z.enum(["LAKI_LAKI", "PEREMPUAN"]);
export type JenisKelamin = z.infer<typeof JenisKelaminEnum>;

export const createPasienSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus tepat 16 digit")
    .regex(/^\d+$/, "NIK harus berupa angka"),
  nama: z.string().min(1, "Nama pasien wajib diisi"),
  jenisKelamin: JenisKelaminEnum,
  tanggalLahir: z.coerce.date({
    message: "Format tanggal lahir tidak valid (YYYY-MM-DD)",
  }),
  noTelepon: z.string().min(10, "Nomor telepon minimal 10 digit"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
});

export const updatePasienSchema = createPasienSchema.partial();

export type CreatePasienDTO = z.infer<typeof createPasienSchema>;
export type UpdatePasienDTO = z.infer<typeof updatePasienSchema>;
