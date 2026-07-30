import { z } from "zod";

export const tindakanMedisSchema = z.object({
  namaTindakan: z.string().min(1, "Nama tindakan medis wajib diisi"),
  catatan: z.string().optional().nullable(),
});

export const resepObatSchema = z.object({
  namaObat: z.string().min(1, "Nama obat wajib diisi"),
  dosis: z.string().min(1, "Dosis wajib diisi (contoh: 3x1)"),
  jumlah: z.number().int().positive("Jumlah obat harus angka positif"),
  aturanPakai: z.string().min(1, "Aturan pakai wajib diisi"),
});

export const createPemeriksaanSchema = z.object({
  registrasiId: z.string().min(1, "Registrasi ID wajib diisi"),
  
  // Subjective
  keluhanSubjective: z.string().min(1, "Keluhan subjektif wajib diisi"),
  
  // Objective (Vital Signs)
  tekananSistolik: z.number().int().positive("Tekanan sistolik harus berupa angka positif"),
  tekananDiastolik: z.number().int().positive("Tekanan diastolik harus berupa angka positif"),
  suhuTubuh: z.number().positive("Suhu tubuh harus berupa angka positif"),
  beratBadan: z.number().positive("Berat badan harus berupa angka positif"),
  tinggiBadan: z.number().positive("Tinggi badan harus berupa angka positif"),
  
  // Assessment
  diagnosa: z.string().min(1, "Diagnosa wajib diisi"),
  
  // Plan
  rencanaTerapi: z.string().min(1, "Rencana terapi wajib diisi"),
  
  tindakan: z.array(tindakanMedisSchema).optional().default([]),
  resep: z.array(resepObatSchema).optional().default([]),
});

export const updatePemeriksaanSchema = createPemeriksaanSchema.partial();

export type TindakanMedisDTO = z.infer<typeof tindakanMedisSchema>;
export type ResepObatDTO = z.infer<typeof resepObatSchema>;
export type CreatePemeriksaanDTO = z.infer<typeof createPemeriksaanSchema>;
export type UpdatePemeriksaanDTO = z.infer<typeof updatePemeriksaanSchema>;
