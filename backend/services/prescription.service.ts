import prisma from "../lib/prisma.js";
import { HttpError } from "../middlewares/error.middleware.js";
import { TokenPayload } from "../utils/jwt.js";

export class PrescriptionService {
  async createPrescription(
    currentUser: TokenPayload,
    data: {
      pemeriksaanId: string;
      namaObat: string;
      dosis: string;
      jumlah: number;
      aturanPakai: string;
    }
  ) {
    if (currentUser.role !== "DOKTER" && currentUser.role !== "ADMIN") {
      throw new HttpError(
        403,
        "Akses ditolak. Hanya Dokter atau Administrator yang dapat membuat resep obat."
      );
    }

    const pemeriksaan = await prisma.pemeriksaan.findUnique({
      where: { id: data.pemeriksaanId },
      include: { registrasi: true },
    });

    if (!pemeriksaan) {
      throw new HttpError(404, "Data rekam medis (pemeriksaanId) tidak ditemukan");
    }

    if (currentUser.role === "DOKTER" && pemeriksaan.registrasi.dokterId !== currentUser.id) {
      throw new HttpError(
        403,
        "Akses ditolak. Anda hanya dapat membuat resep obat untuk pasien yang terdaftar di bawah penanganan Anda."
      );
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
