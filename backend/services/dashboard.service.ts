import prisma from "../lib/prisma.js";

export class DashboardService {
  async getStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalPasien,
      totalPasienHariIni,
      totalAntreanHariIni,
      totalPasienMenunggu,
      totalPasienSelesai,
    ] = await Promise.all([
      prisma.pasien.count(),

      prisma.pasien.count({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),

      // Total Antrean/Kunjungan Hari Ini
      prisma.registrasi.count({
        where: {
          tanggalKunjungan: todayStart,
        },
      }),

      // Total Pasien Menunggu Hari Ini
      prisma.registrasi.count({
        where: {
          tanggalKunjungan: todayStart,
          status: "MENUNGGU",
        },
      }),

      // Total Pasien Selesai Dilayani Hari Ini
      prisma.registrasi.count({
        where: {
          tanggalKunjungan: todayStart,
          status: "SELESAI",
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
