import prisma from "../lib/prisma.js";
import { CreatePoliDTO, UpdatePoliDTO } from "../dtos/poli.dto.js";
import { HttpError } from "../middlewares/error.middleware.js";

export class PoliService {
  async createPoli(data: CreatePoliDTO) {
    const existingPoli = await prisma.poli.findUnique({
      where: { kode: data.kode },
    });

    if (existingPoli) {
      throw new HttpError(400, `Kode poli '${data.kode}' sudah digunakan`);
    }

    return prisma.poli.create({
      data: {
        kode: data.kode,
        nama: data.nama,
      },
    });
  }

  async getAllPoli() {
    return prisma.poli.findMany({
      orderBy: { kode: "asc" },
    });
  }

  async getPoliById(id: string) {
    const poli = await prisma.poli.findUnique({
      where: { id },
    });

    if (!poli) {
      throw new HttpError(404, "Poli tidak ditemukan");
    }

    return poli;
  }

  async updatePoli(id: string, data: UpdatePoliDTO) {
    await this.getPoliById(id);

    if (data.kode) {
      const existingKode = await prisma.poli.findFirst({
        where: {
          kode: data.kode,
          NOT: { id },
        },
      });

      if (existingKode) {
        throw new HttpError(400, `Kode poli '${data.kode}' sudah digunakan oleh poli lain`);
      }
    }

    return prisma.poli.update({
      where: { id },
      data,
    });
  }

  async deletePoli(id: string) {
    await this.getPoliById(id);

    // Cek apakah ada dokter atau registrasi yang masih terhubung
    const associatedUsers = await prisma.user.count({ where: { poliId: id } });
    const associatedRegistrations = await prisma.registrasi.count({ where: { poliId: id } });

    if (associatedUsers > 0 || associatedRegistrations > 0) {
      throw new HttpError(
        400,
        "Poli tidak dapat dihapus karena masih terhubung dengan data dokter atau registrasi"
      );
    }

    return prisma.poli.delete({
      where: { id },
    });
  }
}

export const poliService = new PoliService();
