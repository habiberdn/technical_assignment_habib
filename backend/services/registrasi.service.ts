import { Prisma, StatusKunjungan, StatusAntrean } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { CreateRegistrasiDTO, UpdateStatusRegistrasiDTO } from "../dtos/registrasi.dto.js";
import { HttpError } from "../middlewares/error.middleware.js";
import { TokenPayload } from "../utils/jwt.js";

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

  async panggilAntrean(id: string, currentUser: TokenPayload) {
    const registrasi = await this.getRegistrasiById(id);

    if (registrasi.statusAntrean === "SELESAI") {
      throw new HttpError(400, "Antrean ini sudah selesai dilayani dan tidak dapat dipanggil kembali");
    }

    if (currentUser.role === "DOKTER") {
      if (registrasi.dokterId !== currentUser.id) {
        throw new HttpError(
          403,
          "Akses ditolak. Dokter hanya dapat memanggil pasien yang ditugaskan untuk Anda"
        );
      }
    }

    const updateData: Prisma.RegistrasiUpdateInput = {
      statusAntrean: "DIPANGGIL",
      dipanggilPadaJam: new Date(),
    };

    if (currentUser.role === "DOKTER" && (registrasi.status === "MENUNGGU" || registrasi.status === "CHECK_IN")) {
      updateData.status = "PEMERIKSAAN";
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

  async panggilNextAntrean(currentUser: TokenPayload, poliId?: string, dokterId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let targetPoliId = poliId;
    let targetDokterId = dokterId;

    if (currentUser.role === "DOKTER") {
      const dokterUser = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: { id: true, poliId: true, role: true },
      });

      if (!dokterUser || !dokterUser.poliId) {
        throw new HttpError(
          400,
          "Dokter belum terdaftar di Poliklinik manapun. Silakan hubungi Administrator."
        );
      }

      targetPoliId = dokterUser.poliId;
      targetDokterId = currentUser.id;
    } else {
      if (!targetPoliId) {
        throw new HttpError(
          400,
          "Query parameter 'poliId' wajib disertakan untuk memanggil antrean berikutnya"
        );
      }
    }

    const where: Prisma.RegistrasiWhereInput = {
      poliId: targetPoliId,
      tanggalKunjungan: today,
      statusAntrean: "MENUNGGU",
    };

    if (targetDokterId) {
      where.dokterId = targetDokterId;
    }

    return prisma.$transaction(async (tx) => {
      // Cari antrean berstatus MENUNGGU dengan nomor urut terkecil hari ini
      const nextQueue = await tx.registrasi.findFirst({
        where,
        orderBy: { nomorUrutAntrean: "asc" },
      });

      if (!nextQueue) {
        throw new HttpError(404, "Tidak ada antrean berstatus MENUNGGU untuk dipanggil");
      }

      const updateData: Prisma.RegistrasiUpdateInput = {
        statusAntrean: "DIPANGGIL",
        dipanggilPadaJam: new Date(),
      };

      if (currentUser.role === "DOKTER" && (nextQueue.status === "MENUNGGU" || nextQueue.status === "CHECK_IN")) {
        updateData.status = "PEMERIKSAAN";
      }

      return tx.registrasi.update({
        where: { id: nextQueue.id },
        data: updateData,
        include: {
          pasien: true,
          poli: true,
          dokter: { select: { id: true, nama: true } },
        },
      });
    });
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

    // Validasi: MENUNGGU tidak boleh langsung SELESAI tanpa dilakukan pemeriksaan
    if (current.status === "MENUNGGU" && data.status === "SELESAI" && !current.pemeriksaan) {
      throw new HttpError(
        400,
        "Pasien berstatus MENUNGGU tidak dapat langsung diubah ke SELESAI sebelum dilakukan pemeriksaan medis"
      );
    }

    const updateData: Prisma.RegistrasiUpdateInput = {};
    if (data.status) updateData.status = data.status;
    if (data.statusAntrean) updateData.statusAntrean = data.statusAntrean;

    // Sinkronisasi otomatis: jika status kunjungan SELESAI, status antrean ikut SELESAI
    if (data.status === "SELESAI") {
      updateData.statusAntrean = "SELESAI";
    }

    // Jika status kunjungan diubah ke PEMERIKSAAN, status antrean di-set ke DIPANGGIL jika belum
    if (data.status === "PEMERIKSAAN" && current.statusAntrean !== "SELESAI") {
      updateData.statusAntrean = "DIPANGGIL";
      if (!current.dipanggilPadaJam) {
        updateData.dipanggilPadaJam = new Date();
      }
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
