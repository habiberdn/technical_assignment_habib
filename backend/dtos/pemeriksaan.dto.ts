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
  tekananSistolik: z.number().int().min(30, "Sistolik minimal 30 mmHg").max(300, "Sistolik maksimal 300 mmHg"),
  tekananDiastolik: z.number().int().min(20, "Diastolik minimal 20 mmHg").max(200, "Diastolik maksimal 200 mmHg"),
  suhuTubuh: z.number().min(30, "Suhu tubuh minimal 30 °C").max(45, "Suhu tubuh maksimal 45 °C"),
  beratBadan: z.number().min(0.5, "Berat badan minimal 0.5 kg").max(500, "Berat badan maksimal 500 kg"),
  tinggiBadan: z.number().min(20, "Tinggi badan minimal 20 cm").max(300, "Tinggi badan maksimal 300 cm"),
  
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
