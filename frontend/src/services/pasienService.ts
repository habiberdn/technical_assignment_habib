import api from "./api.js";
import type { Pasien, PasienListParams, PasienListResponse } from "../types/pasien.types.js";
import type { CreatePasienDTO, UpdatePasienDTO } from "../dtos/pasien.dto.js";

export const pasienService = {
  getPasienList: async (params?: PasienListParams): Promise<PasienListResponse> => {
    const response = await api.get("/pasien", { params });
    return {
      data: response.data?.data || [],
      meta: response.data?.meta || {
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
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
