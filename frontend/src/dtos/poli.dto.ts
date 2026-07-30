import { z } from "zod";

export const createPoliSchema = z.object({
  kode: z
    .string()
    .min(2, "Kode poli minimal 2 karakter")
    .max(10, "Kode poli maksimal 10 karakter")
    .transform((val) => val.toUpperCase()),
  nama: z.string().min(1, "Nama poli wajib diisi"),
});

export const updatePoliSchema = createPoliSchema.partial();

export type CreatePoliDTO = z.infer<typeof createPoliSchema>;
export type UpdatePoliDTO = z.infer<typeof updatePoliSchema>;
