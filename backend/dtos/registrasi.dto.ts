import { z } from "zod";

export const JenisPembayaranEnum = z.enum(["UMUM", "BPJS", "ASURANSI"]);
export const StatusKunjunganEnum = z.enum(["MENUNGGU", "CHECK_IN", "PEMERIKSAAN", "SELESAI"]);
export const StatusAntreanEnum = z.enum(["MENUNGGU", "DIPANGGIL", "SELESAI", "DILEWATI"]);

export type JenisPembayaran = z.infer<typeof JenisPembayaranEnum>;
export type StatusKunjungan = z.infer<typeof StatusKunjunganEnum>;
export type StatusAntrean = z.infer<typeof StatusAntreanEnum>;

export const createRegistrasiSchema = z.object({
  pasienId: z.string().min(1, "Pasien ID wajib diisi"),
  dokterId: z.string().min(1, "Dokter ID wajib diisi"),
  poliId: z.string().min(1, "Poli ID wajib diisi"),
  tanggalKunjungan: z.coerce.date().optional().default(() => new Date()),
  jenisPembayaran: JenisPembayaranEnum,
  keluhanAwal: z.string().min(1, "Keluhan awal wajib diisi"),
});

export const updateStatusRegistrasiSchema = z.object({
  status: StatusKunjunganEnum.optional(),
  statusAntrean: StatusAntreanEnum.optional(),
});

export type CreateRegistrasiDTO = z.infer<typeof createRegistrasiSchema>;
export type UpdateStatusRegistrasiDTO = z.infer<typeof updateStatusRegistrasiSchema>;
