export type JenisKelamin = "LAKI_LAKI" | "PEREMPUAN";

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
