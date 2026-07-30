import prisma from "../lib/prisma.js";
import { CreatePasienDTO, UpdatePasienDTO } from "../dtos/pasien.dto.js";
import { HttpError } from "../middlewares/error.middleware.js";

export class PasienService {
  private async generateNoRekamMedis(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const prefix = `RM-${year}${month}${day}-`;

    // Cari pasien dengan nomor rekam medis paling akhir pada hari ini
    const lastPasien = await prisma.pasien.findFirst({
      where: {
        noRekamMedis: {
          startsWith: prefix,
        },
      },
      orderBy: {
        noRekamMedis: "desc",
      },
      select: {
        noRekamMedis: true,
      },
    });

    let sequence = 1;
    if (lastPasien && lastPasien.noRekamMedis) {
      const lastSequenceStr = lastPasien.noRekamMedis.replace(prefix, "");
      const parsedSeq = parseInt(lastSequenceStr, 10);
      if (!isNaN(parsedSeq)) {
        sequence = parsedSeq + 1;
      }
    }

    const sequenceStr = String(sequence).padStart(3, "0");
    return `${prefix}${sequenceStr}`;
  }

  async createPasien(data: CreatePasienDTO) {
    const existingNik = await prisma.pasien.findUnique({
      where: { nik: data.nik },
    });

    if (existingNik) {
      throw new HttpError(400, `NIK '${data.nik}' sudah terdaftar pada sistem`);
    }

    const noRekamMedis = await this.generateNoRekamMedis();

    return prisma.pasien.create({
      data: {
        ...data,
        noRekamMedis,
      },
    });
  }

  async getPasienList(query: { search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const searchWhere = query.search
      ? {
          OR: [
            { nama: { contains: query.search, mode: "insensitive" as const } },
            { nik: { contains: query.search } },
            { noRekamMedis: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [totalData, data] = await Promise.all([
      prisma.pasien.count({ where: searchWhere }),
      prisma.pasien.findMany({
        where: searchWhere,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        totalData,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getPasienById(id: string) {
    const pasien = await prisma.pasien.findUnique({
      where: { id },
      include: {
        registrasi: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            poli: true,
            dokter: { select: { id: true, nama: true } },
          },
        },
      },
    });

    if (!pasien) {
      throw new HttpError(404, "Data pasien tidak ditemukan");
    }

    return pasien;
  }

  async updatePasien(id: string, data: UpdatePasienDTO) {
    await this.getPasienById(id);

    if (data.nik) {
      const existingNik = await prisma.pasien.findFirst({
        where: {
          nik: data.nik,
          NOT: { id },
        },
      });

      if (existingNik) {
        throw new HttpError(400, `NIK '${data.nik}' sudah digunakan oleh pasien lain`);
      }
    }

    return prisma.pasien.update({
      where: { id },
      data,
    });
  }

  async deletePasien(id: string) {
    await this.getPasienById(id);

    const registrationCount = await prisma.registrasi.count({
      where: { pasienId: id },
    });

    if (registrationCount > 0) {
      throw new HttpError(
        400,
        "Data pasien tidak dapat dihapus karena memiliki riwayat pendaftaran/kunjungan"
      );
    }

    return prisma.pasien.delete({
      where: { id },
    });
  }
}

export const pasienService = new PasienService();
