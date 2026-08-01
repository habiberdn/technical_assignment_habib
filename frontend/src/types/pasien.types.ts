export type JenisKelamin = "LAKI_LAKI" | "PEREMPUAN";

export interface RegistrasiItem {
  id: string;
  tanggalKunjungan: string;
  jenisPembayaran: "UMUM" | "BPJS" | "ASURANSI";
  keluhanAwal: string;
  status: "MENUNGGU" | "CHECK_IN" | "PEMERIKSAAN" | "SELESAI";
  nomorAntrean: string;
  poli?: {
    id: string;
    kode: string;
    nama: string;
  };
  dokter?: {
    id: string;
    nama: string;
  };
  createdAt?: string;
}

export interface Pasien {
  id: string;
  noRekamMedis: string;
  nik: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  tanggalLahir: string;
  noTelepon: string;
  alamat: string;
  createdAt?: string;
  updatedAt?: string;
  registrasi?: RegistrasiItem[];
}

export interface PasienListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PasienListResponse {
  data: Pasien[];
  meta: PaginationMeta;
}
