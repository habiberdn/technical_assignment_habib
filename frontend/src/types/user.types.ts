export type UserRole = "ADMIN" | "DOKTER" | "PETUGAS_PENDAFTARAN";

export interface UserItem {
  id: string;
  username: string;
  nama: string;
  role: UserRole;
  isActive: boolean;
  poliId?: string | null;
  createdAt: string;
  updatedAt?: string;
  poli?: {
    id: string;
    kode: string;
    nama: string;
  } | null;
}

export interface UserPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserQueryParams {
  search?: string;
  role?: string;
  poliId?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}
