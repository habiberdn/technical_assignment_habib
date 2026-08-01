import api from "@/services/api.js";
import type { Poli } from "@/types/poli.types.js";
import type { CreatePoliDTO, UpdatePoliDTO } from "@/dtos/poli.dto.js";

export const poliService = {
  getAllPoli: async (): Promise<Poli[]> => {
    const response = await api.get("/poli");
    return response.data?.data || [];
  },

  getPoliById: async (id: string): Promise<Poli> => {
    const response = await api.get(`/poli/${id}`);
    return response.data.data;
  },

  createPoli: async (data: CreatePoliDTO): Promise<Poli> => {
    const response = await api.post("/poli", data);
    return response.data.data;
  },

  updatePoli: async (id: string, data: UpdatePoliDTO): Promise<Poli> => {
    const response = await api.put(`/poli/${id}`, data);
    return response.data.data;
  },

  deletePoli: async (id: string): Promise<void> => {
    await api.delete(`/poli/${id}`);
  },
};
