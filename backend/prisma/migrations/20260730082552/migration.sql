-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOKTER', 'PETUGAS_PENDAFTARAN');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "JenisPembayaran" AS ENUM ('UMUM', 'BPJS', 'ASURANSI');

-- CreateEnum
CREATE TYPE "StatusKunjungan" AS ENUM ('MENUNGGU', 'CHECK_IN', 'PEMERIKSAAN', 'SELESAI');

-- CreateEnum
CREATE TYPE "StatusAntrean" AS ENUM ('MENUNGGU', 'DIPANGGIL', 'SELESAI', 'DILEWATI');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "poliId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pasien" (
    "id" TEXT NOT NULL,
    "noRekamMedis" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tanggalLahir" DATE NOT NULL,
    "noTelepon" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pasien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poli" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "poli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrasi" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "dokterId" TEXT NOT NULL,
    "petugasId" TEXT NOT NULL,
    "poliId" TEXT NOT NULL,
    "tanggalKunjungan" DATE NOT NULL,
    "jenisPembayaran" "JenisPembayaran" NOT NULL,
    "keluhanAwal" TEXT NOT NULL,
    "status" "StatusKunjungan" NOT NULL DEFAULT 'MENUNGGU',
    "nomorUrutAntrean" INTEGER NOT NULL,
    "nomorAntrean" TEXT NOT NULL,
    "statusAntrean" "StatusAntrean" NOT NULL DEFAULT 'MENUNGGU',
    "dipanggilPadaJam" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemeriksaan" (
    "id" TEXT NOT NULL,
    "registrasiId" TEXT NOT NULL,
    "keluhanSubjective" TEXT NOT NULL,
    "tekananSistolik" INTEGER NOT NULL,
    "tekananDiastolik" INTEGER NOT NULL,
    "suhuTubuh" DOUBLE PRECISION NOT NULL,
    "beratBadan" DOUBLE PRECISION NOT NULL,
    "tinggiBadan" DOUBLE PRECISION NOT NULL,
    "diagnosa" TEXT NOT NULL,
    "rencanaTerapi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pemeriksaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tindakan_medis" (
    "id" TEXT NOT NULL,
    "pemeriksaanId" TEXT NOT NULL,
    "namaTindakan" TEXT NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "tindakan_medis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resep_obat" (
    "id" TEXT NOT NULL,
    "pemeriksaanId" TEXT NOT NULL,
    "namaObat" TEXT NOT NULL,
    "dosis" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "aturanPakai" TEXT NOT NULL,

    CONSTRAINT "resep_obat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pasien_noRekamMedis_key" ON "pasien"("noRekamMedis");

-- CreateIndex
CREATE UNIQUE INDEX "pasien_nik_key" ON "pasien"("nik");

-- CreateIndex
CREATE INDEX "pasien_nama_idx" ON "pasien"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "poli_kode_key" ON "poli"("kode");

-- CreateIndex
CREATE INDEX "registrasi_tanggalKunjungan_status_idx" ON "registrasi"("tanggalKunjungan", "status");

-- CreateIndex
CREATE UNIQUE INDEX "registrasi_poliId_tanggalKunjungan_nomorUrutAntrean_key" ON "registrasi"("poliId", "tanggalKunjungan", "nomorUrutAntrean");

-- CreateIndex
CREATE UNIQUE INDEX "pemeriksaan_registrasiId_key" ON "pemeriksaan"("registrasiId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_poliId_fkey" FOREIGN KEY ("poliId") REFERENCES "poli"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrasi" ADD CONSTRAINT "registrasi_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrasi" ADD CONSTRAINT "registrasi_dokterId_fkey" FOREIGN KEY ("dokterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrasi" ADD CONSTRAINT "registrasi_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrasi" ADD CONSTRAINT "registrasi_poliId_fkey" FOREIGN KEY ("poliId") REFERENCES "poli"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan" ADD CONSTRAINT "pemeriksaan_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "registrasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tindakan_medis" ADD CONSTRAINT "tindakan_medis_pemeriksaanId_fkey" FOREIGN KEY ("pemeriksaanId") REFERENCES "pemeriksaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resep_obat" ADD CONSTRAINT "resep_obat_pemeriksaanId_fkey" FOREIGN KEY ("pemeriksaanId") REFERENCES "pemeriksaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
