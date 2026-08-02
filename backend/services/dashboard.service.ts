import prisma from "../lib/prisma.js";
import { normalizeDateForDb } from "../utils/date.js";
import { TokenPayload } from "../utils/jwt.js";

export class DashboardService {
  async getStats(user?: TokenPayload) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayDbDate = normalizeDateForDb();

    const isDokter = user?.role === "DOKTER";
    const dokterFilter = isDokter && user?.id ? { dokterId: user.id } : {};

    const [
      totalPasien,
      totalPasienHariIni,
      totalAntreanHariIni,
      totalPasienMenunggu,
      totalPasienSelesai,
    ] = await Promise.all([
      prisma.pasien.count({
        where: isDokter && user?.id
          ? {
              registrasi: {
                some: { dokterId: user.id },
              },
            }
          : undefined,
      }),

      prisma.pasien.count({
        where: isDokter && user?.id
          ? {
              createdAt: {
                gte: todayStart,
                lte: todayEnd,
              },
              registrasi: {
                some: { dokterId: user.id },
              },
            }
          : {
              createdAt: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
      }),

      // Total Antrean/Kunjungan Hari Ini
      prisma.registrasi.count({
        where: {
          tanggalKunjungan: todayDbDate,
          ...dokterFilter,
        },
      }),

      // Total Pasien Menunggu Hari Ini
      prisma.registrasi.count({
        where: {
          tanggalKunjungan: todayDbDate,
          status: "MENUNGGU",
          ...dokterFilter,
        },
      }),

      // Total Pasien Selesai Dilayani Hari Ini
      prisma.registrasi.count({
        where: {
          tanggalKunjungan: todayDbDate,
          status: "SELESAI",
          ...dokterFilter,
        },
      }),
    ]);

    return {
      totalPasien,
      totalPasienHariIni,
      totalAntreanHariIni,
      totalPasienMenunggu,
      totalPasienSelesai,
    };
  }
}

export const dashboardService = new DashboardService();
