import type { RegistrasiItem } from "./registrasi.types.js";

export interface TindakanMedis {
  id?: string;
  pemeriksaanId?: string;
  namaTindakan: string;
  catatan?: string | null;
}

export interface ResepObat {
  id?: string;
  pemeriksaanId?: string;
  namaObat: string;
  dosis: string;
  jumlah: number;
  aturanPakai: string;
}

export interface PemeriksaanItem {
  id: string;
  registrasiId: string;
  keluhanSubjective: string;
  tekananSistolik: number;
  tekananDiastolik: number;
  suhuTubuh: number;
  beratBadan: number;
  tinggiBadan: number;
  diagnosa: string;
  rencanaTerapi: string;
  createdAt: string;
  updatedAt: string;
  registrasi?: RegistrasiItem;
  tindakan?: TindakanMedis[];
  resep?: ResepObat[];
}

export interface RiwayatPemeriksaanResponse {
  pasien: {
    id: string;
    nama: string;
    nik: string;
    noRekamMedis: string;
    tanggalLahir: string;
    jenisKelamin: string;
  };
  totalKunjungan: number;
  riwayat: PemeriksaanItem[];
}
