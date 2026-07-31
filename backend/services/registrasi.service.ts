import { Prisma, StatusKunjungan, StatusAntrean } from "@prisma/client";
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

    // Validasi: Pastikan Dokter bertugas di Poli yang sesuai jika terikat Poli
    if (dokter.poliId && dokter.poliId !== data.poliId) {
      throw new HttpError(400, "Dokter yang dipilih tidak bertugas di Poli tersebut");
    }

    const targetDate = data.tanggalKunjungan ? new Date(data.tanggalKunjungan) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Cek apakah pasien sudah memiliki registrasi aktif (belum SELESAI) di hari yang sama
    const existingActiveReg = await prisma.registrasi.findFirst({
      where: {
        pasienId: data.pasienId,
        poliId: data.poliId,
        tanggalKunjungan: targetDate,
        NOT: { status: "SELESAI" },
      },
    });

    if (existingActiveReg) {
      throw new HttpError(
        400,
        `Pasien sudah terdaftar pada Poli ini untuk hari yang sama dengan antrean '${existingActiveReg.nomorAntrean}'`
      );
    }

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
    const where: Prisma.RegistrasiWhereInput = {};

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
      where.status = query.status as StatusKunjungan;
    }

    if (query.statusAntrean) {
      where.statusAntrean = query.statusAntrean as StatusAntrean;
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
    const registrasi = await this.getRegistrasiById(id);

    if (registrasi.statusAntrean === "SELESAI") {
      throw new HttpError(400, "Antrean ini sudah selesai dilayani dan tidak dapat dipanggil kembali");
    }

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

  async panggilNextAntrean(poliId: string, dokterId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const where: Prisma.RegistrasiWhereInput = {
      poliId,
      tanggalKunjungan: today,
      statusAntrean: "MENUNGGU",
    };

    if (dokterId) {
      where.dokterId = dokterId;
    }

    // Cari antrean berstatus MENUNGGU dengan nomor urut terkecil hari ini
    const nextQueue = await prisma.registrasi.findFirst({
      where,
      orderBy: { nomorUrutAntrean: "asc" },
    });

    if (!nextQueue) {
      throw new HttpError(404, "Tidak ada antrean berstatus MENUNGGU untuk dipanggil");
    }

    return this.panggilAntrean(nextQueue.id);
  }

  async updateStatus(id: string, data: UpdateStatusRegistrasiDTO) {
    const current = await this.getRegistrasiById(id);

    // Validasi State Machine: Status SELESAI adalah status final
    if (current.status === "SELESAI" && data.status && data.status !== "SELESAI") {
      throw new HttpError(
        400,
        "Status kunjungan yang sudah SELESAI tidak dapat diubah kembali ke status sebelumnya"
      );
    }

    const updateData: Prisma.RegistrasiUpdateInput = {};
    if (data.status) updateData.status = data.status;
    if (data.statusAntrean) updateData.statusAntrean = data.statusAntrean;

    // Sinkronisasi otomatis: jika status kunjungan SELESAI, status antrean ikut SELESAI
    if (data.status === "SELESAI") {
      updateData.statusAntrean = "SELESAI";
    }

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
