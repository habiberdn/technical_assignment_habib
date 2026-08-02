import prisma from "../lib/prisma.js";
import { HttpError } from "../middlewares/error.middleware.js";

export class PrescriptionService {
  async createPrescription(data: {
    pemeriksaanId: string;
    namaObat: string;
    dosis: string;
    jumlah: number;
    aturanPakai: string;
  }) {
    const pemeriksaan = await prisma.pemeriksaan.findUnique({
      where: { id: data.pemeriksaanId },
    });

    if (!pemeriksaan) {
      throw new HttpError(404, "Data rekam medis (pemeriksaanId) tidak ditemukan");
    }

    return prisma.resepObat.create({
      data: {
        pemeriksaanId: data.pemeriksaanId,
        namaObat: data.namaObat,
        dosis: data.dosis,
        jumlah: Number(data.jumlah),
        aturanPakai: data.aturanPakai || "Sesudah Makan",
      },
    });
  }

  async getPrescriptionById(id: string) {
    const prescription = await prisma.resepObat.findUnique({
      where: { id },
      include: {
        pemeriksaan: {
          include: {
            registrasi: {
              include: {
                pasien: true,
                dokter: { select: { id: true, nama: true } },
                poli: true,
              },
            },
          },
        },
      },
    });

    if (!prescription) {
      throw new HttpError(404, "Data resep obat tidak ditemukan");
    }

    return prescription;
  }
}

export const prescriptionService = new PrescriptionService();
