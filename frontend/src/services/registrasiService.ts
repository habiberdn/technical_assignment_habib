import api from "@/services/api.js";
import type {
  RegistrasiItem,
  RegistrasiListParams,
  DokterItem,
} from "@/types/registrasi.types.js";
import type { CreateRegistrasiDTO, UpdateStatusRegistrasiDTO } from "@/dtos/registrasi.dto.js";

export const registrasiService = {
  getRegistrasiList: async (params?: RegistrasiListParams): Promise<RegistrasiItem[]> => {
    const response = await api.get("/registrasi", { params });
    return response.data?.data || [];
  },

  getRegistrasiById: async (id: string): Promise<RegistrasiItem> => {
    const response = await api.get(`/registrasi/${id}`);
    return response.data?.data;
  },

  createRegistrasi: async (data: CreateRegistrasiDTO): Promise<RegistrasiItem> => {
    const response = await api.post("/registrasi", data);
    return response.data?.data;
  },

  panggilAntrean: async (id: string): Promise<RegistrasiItem> => {
    const response = await api.patch(`/registrasi/${id}/panggil`);
    return response.data?.data;
  },

  panggilNextAntrean: async (poliId: string, dokterId?: string): Promise<RegistrasiItem> => {
    const response = await api.patch("/registrasi/panggil-next", {}, {
      params: { poliId, dokterId },
    });
    return response.data?.data;
  },

  updateStatus: async (id: string, data: UpdateStatusRegistrasiDTO): Promise<RegistrasiItem> => {
    const response = await api.patch(`/registrasi/${id}/status`, data);
    return response.data?.data;
  },

  getDoctors: async (poliId?: string): Promise<DokterItem[]> => {
    const response = await api.get("/auth/doctors", { params: { poliId } });
    return response.data?.data || [];
  },
};
