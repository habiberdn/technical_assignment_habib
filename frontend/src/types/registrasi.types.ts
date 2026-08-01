import type { Pasien } from "./pasien.types.js";
import type { Poli } from "./poli.types.js";

export type JenisPembayaran = "UMUM" | "BPJS" | "ASURANSI";
export type StatusKunjungan = "MENUNGGU" | "CHECK_IN" | "PEMERIKSAAN" | "SELESAI";
export type StatusAntrean = "MENUNGGU" | "DIPANGGIL" | "SELESAI" | "DILEWATI";

export interface DokterItem {
  id: string;
  nama: string;
  username: string;
  poliId?: string | null;
  poli?: Poli;
}

export interface RegistrasiItem {
  id: string;
  pasienId: string;
  pasien: Pasien;
  dokterId: string;
  dokter: DokterItem;
  petugasId: string;
  petugas?: {
    id: string;
    nama: string;
    username: string;
  };
  poliId: string;
  poli: Poli;
  tanggalKunjungan: string;
  jenisPembayaran: JenisPembayaran;
  keluhanAwal: string;
  status: StatusKunjungan;
  nomorUrutAntrean: number;
  nomorAntrean: string;
  statusAntrean: StatusAntrean;
  dipanggilPadaJam?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrasiListParams {
  tanggalKunjungan?: string;
  poliId?: string;
  dokterId?: string;
  status?: StatusKunjungan;
  statusAntrean?: StatusAntrean;
  search?: string;
}
