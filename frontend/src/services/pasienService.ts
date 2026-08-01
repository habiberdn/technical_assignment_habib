import api from "@/services/api.js";
import type { Pasien, PasienListParams, PasienListResponse } from "@/types/pasien.types.js";
import type { CreatePasienDTO, UpdatePasienDTO } from "@/dtos/pasien.dto.js";

export const pasienService = {
  getPasienList: async (params?: PasienListParams): Promise<PasienListResponse> => {
    const response = await api.get("/pasien", { params });
    const rawMeta = response.data?.meta || {};
    return {
      data: response.data?.data || [],
      meta: {
        total: rawMeta.total ?? rawMeta.totalData ?? 0,
        page: rawMeta.page ?? params?.page ?? 1,
        limit: rawMeta.limit ?? params?.limit ?? 10,
        totalPages: rawMeta.totalPages ?? 1,
      },
    };
  },

  getPasienById: async (id: string): Promise<Pasien> => {
    const response = await api.get(`/pasien/${id}`);
    return response.data.data;
  },

  createPasien: async (data: CreatePasienDTO): Promise<Pasien> => {
    const response = await api.post("/pasien", data);
    return response.data.data;
  },

  updatePasien: async (id: string, data: UpdatePasienDTO): Promise<Pasien> => {
    const response = await api.put(`/pasien/${id}`, data);
    return response.data.data;
  },

  deletePasien: async (id: string): Promise<void> => {
    await api.delete(`/pasien/${id}`);
  },
};
