import prisma from "../lib/prisma.js";
import { CreateRegistrasiDTO, UpdateStatusRegistrasiDTO } from "../dtos/registrasi.dto.js";
import { HttpError } from "../middlewares/error.middleware.js";

export class RegistrasiService {
  async createRegistrasi(petugasId: string, data: CreateRegistrasiDTO) {
    const pasien = await prisma.pasien.findUnique({
      where: { id: data.pasienId },
    });
    if (!pasien) {
      throw new HttpError(404, "Pasien tidak ditemukan");
    }

    const dokter = await prisma.user.findFirst({
      where: { id: data.dokterId, role: "DOKTER" },
    });
    if (!dokter) {
      throw new HttpError(404, "Dokter tidak ditemukan atau user bukan ber-role DOKTER");
    }

    const poli = await prisma.poli.findUnique({
      where: { id: data.poliId },
    });
    if (!poli) {
      throw new HttpError(404, "Poli tidak ditemukan");
    }

    const targetDate = data.tanggalKunjungan ? new Date(data.tanggalKunjungan) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    return prisma.$transaction(async (tx) => {
      const lastRegistrasi = await tx.registrasi.findFirst({
        where: {
          poliId: data.poliId,
          tanggalKunjungan: targetDate,
        },
        orderBy: {
          nomorUrutAntrean: "desc",
        },
        select: {
          nomorUrutAntrean: true,
        },
      });

      const nomorUrutAntrean = (lastRegistrasi?.nomorUrutAntrean || 0) + 1;
      const nomorAntrean = `${poli.kode}${String(nomorUrutAntrean).padStart(3, "0")}`;

      const registrasi = await tx.registrasi.create({
        data: {
          pasienId: data.pasienId,
          dokterId: data.dokterId,
          petugasId: petugasId,
          poliId: data.poliId,
          tanggalKunjungan: targetDate,
          jenisPembayaran: data.jenisPembayaran,
          keluhanAwal: data.keluhanAwal,
          status: "MENUNGGU",
          nomorUrutAntrean,
          nomorAntrean,
          statusAntrean: "MENUNGGU",
        },
        include: {
          pasien: true,
          dokter: { select: { id: true, nama: true, username: true } },
          petugas: { select: { id: true, nama: true, username: true } },
          poli: true,
        },
      });

      return registrasi;
    });
  }

  async getRegistrasiList(query: {
    tanggalKunjungan?: string;
    poliId?: string;
    dokterId?: string;
    status?: string;
    statusAntrean?: string;
    search?: string;
  }) {
    const where: any = {};

    if (query.tanggalKunjungan) {
      const date = new Date(query.tanggalKunjungan);
      date.setHours(0, 0, 0, 0);
      where.tanggalKunjungan = date;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.tanggalKunjungan = today;
    }

    if (query.poliId) {
      where.poliId = query.poliId;
    }

    if (query.dokterId) {
      where.dokterId = query.dokterId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.statusAntrean) {
      where.statusAntrean = query.statusAntrean;
    }

    if (query.search) {
      where.OR = [
        { nomorAntrean: { contains: query.search, mode: "insensitive" } },
        { pasien: { nama: { contains: query.search, mode: "insensitive" } } },
        { pasien: { noRekamMedis: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    return prisma.registrasi.findMany({
      where,
      orderBy: { nomorUrutAntrean: "asc" },
      include: {
        pasien: true,
        dokter: { select: { id: true, nama: true } },
        poli: true,
        pemeriksaan: true,
      },
    });
  }

  async getRegistrasiById(id: string) {
    const registrasi = await prisma.registrasi.findUnique({
      where: { id },
      include: {
        pasien: true,
        dokter: { select: { id: true, nama: true, role: true } },
        petugas: { select: { id: true, nama: true, role: true } },
        poli: true,
        pemeriksaan: {
          include: {
            tindakan: true,
            resep: true,
          },
        },
      },
    });

    if (!registrasi) {
      throw new HttpError(404, "Data registrasi/antrean tidak ditemukan");
    }

    return registrasi;
  }

  async panggilAntrean(id: string) {
    await this.getRegistrasiById(id);

    return prisma.registrasi.update({
      where: { id },
      data: {
        statusAntrean: "DIPANGGIL",
        dipanggilPadaJam: new Date(),
      },
      include: {
        pasien: true,
        poli: true,
        dokter: { select: { id: true, nama: true } },
      },
    });
  }

  async updateStatus(id: string, data: UpdateStatusRegistrasiDTO) {
    await this.getRegistrasiById(id);

    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.statusAntrean) updateData.statusAntrean = data.statusAntrean;

    return prisma.registrasi.update({
      where: { id },
      data: updateData,
      include: {
        pasien: true,
        poli: true,
        dokter: { select: { id: true, nama: true } },
      },
    });
  }
}

export const registrasiService = new RegistrasiService();
