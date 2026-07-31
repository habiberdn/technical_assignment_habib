import prisma from "../lib/prisma.js";
import { CreatePemeriksaanDTO, UpdatePemeriksaanDTO } from "../dtos/pemeriksaan.dto.js";
import { HttpError } from "../middlewares/error.middleware.js";

export class PemeriksaanService {
  async createPemeriksaan(data: CreatePemeriksaanDTO) {
    const registrasi = await prisma.registrasi.findUnique({
      where: { id: data.registrasiId },
    });

    if (!registrasi) {
      throw new HttpError(404, "Data registrasi/kunjungan tidak ditemukan");
    }

    const existingExam = await prisma.pemeriksaan.findUnique({
      where: { registrasiId: data.registrasiId },
    });

    if (existingExam) {
      throw new HttpError(400, "Pasien pada registrasi ini sudah dilakukan pemeriksaan");
    }

    return prisma.$transaction(async (tx) => {
      const pemeriksaan = await tx.pemeriksaan.create({
        data: {
          registrasiId: data.registrasiId,
          keluhanSubjective: data.keluhanSubjective,
          tekananSistolik: data.tekananSistolik,
          tekananDiastolik: data.tekananDiastolik,
          suhuTubuh: data.suhuTubuh,
          beratBadan: data.beratBadan,
          tinggiBadan: data.tinggiBadan,
          diagnosa: data.diagnosa,
          rencanaTerapi: data.rencanaTerapi,
          tindakan: {
            create: data.tindakan || [],
          },
          resep: {
            create: data.resep || [],
          },
        },
        include: {
          registrasi: {
            include: {
              pasien: true,
              dokter: { select: { id: true, nama: true } },
              poli: true,
            },
          },
          tindakan: true,
          resep: true,
        },
      });

      await tx.registrasi.update({
        where: { id: data.registrasiId },
        data: {
          status: "SELESAI",
          statusAntrean: "SELESAI",
        },
      });

      return pemeriksaan;
    });
  }

  async getPemeriksaanById(id: string) {
    const pemeriksaan = await prisma.pemeriksaan.findUnique({
      where: { id },
      include: {
        registrasi: {
          include: {
            pasien: true,
            dokter: { select: { id: true, nama: true, username: true } },
            petugas: { select: { id: true, nama: true } },
            poli: true,
          },
        },
        tindakan: true,
        resep: true,
      },
    });

    if (!pemeriksaan) {
      throw new HttpError(404, "Data pemeriksaan tidak ditemukan");
    }

    return pemeriksaan;
  }

  async updatePemeriksaan(id: string, data: UpdatePemeriksaanDTO) {
    await this.getPemeriksaanById(id);

    return prisma.$transaction(async (tx) => {
      const { tindakan, resep, registrasiId, ...examData } = data;

      const updatedExam = await tx.pemeriksaan.update({
        where: { id },
        data: examData,
      });

      if (tindakan) {
        await tx.tindakanMedis.deleteMany({ where: { pemeriksaanId: id } });
        if (tindakan.length > 0) {
          await tx.tindakanMedis.createMany({
            data: tindakan.map((t) => ({ ...t, pemeriksaanId: id })),
          });
        }
      }

      if (resep) {
        await tx.resepObat.deleteMany({ where: { pemeriksaanId: id } });
        if (resep.length > 0) {
          await tx.resepObat.createMany({
            data: resep.map((r) => ({ ...r, pemeriksaanId: id })),
          });
        }
      }

      return this.getPemeriksaanById(id);
    });
  }

  async getRiwayatPemeriksaanPasien(pasienId: string) {
    const pasien = await prisma.pasien.findUnique({
      where: { id: pasienId },
    });

    if (!pasien) {
      throw new HttpError(404, "Pasien tidak ditemukan");
    }

    const riwayat = await prisma.pemeriksaan.findMany({
      where: {
        registrasi: {
          pasienId,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        registrasi: {
          include: {
            dokter: { select: { id: true, nama: true } },
            poli: true,
          },
        },
        tindakan: true,
        resep: true,
      },
    });

    return {
      pasien,
      totalKunjungan: riwayat.length,
      riwayat,
    };
  }
}

export const pemeriksaanService = new PemeriksaanService();
