export interface Poli {
  id: string;
  kode: string;
  nama: string;
  _count?: {
    dokter?: number;
    registrasi?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PoliListParams {
  search?: string;
}

export interface PoliListResponse {
  data: Poli[];
}
