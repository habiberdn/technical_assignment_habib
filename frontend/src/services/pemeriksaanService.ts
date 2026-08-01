import api from "@/services/api.js";
import type { CreatePemeriksaanDTO, UpdatePemeriksaanDTO } from "@/dtos/pemeriksaan.dto.js";
import type { PemeriksaanItem, RiwayatPemeriksaanResponse } from "@/types/pemeriksaan.types.js";

export const pemeriksaanService = {
  createPemeriksaan: async (data: CreatePemeriksaanDTO): Promise<PemeriksaanItem> => {
    const response = await api.post("/pemeriksaan", data);
    return response.data.data;
  },

  getPemeriksaanById: async (id: string): Promise<PemeriksaanItem> => {
    const response = await api.get(`/pemeriksaan/${id}`);
    return response.data.data;
  },

  updatePemeriksaan: async (id: string, data: UpdatePemeriksaanDTO): Promise<PemeriksaanItem> => {
    const response = await api.put(`/pemeriksaan/${id}`, data);
    return response.data.data;
  },

  getRiwayatPemeriksaanPasien: async (pasienId: string): Promise<RiwayatPemeriksaanResponse> => {
    const response = await api.get(`/pemeriksaan/pasien/${pasienId}/riwayat`);
    return response.data.data;
  },
};
