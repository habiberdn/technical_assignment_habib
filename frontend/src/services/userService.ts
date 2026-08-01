import api from "./api.js";
import type { UserItem, UserPaginationMeta, UserQueryParams } from "@/types/user.types.js";

export const userService = {
  getUsers: async (params?: UserQueryParams): Promise<{ data: UserItem[]; meta: UserPaginationMeta }> => {
    const res = await api.get<{ data: UserItem[]; meta: UserPaginationMeta }>("/users", { params });
    return res.data;
  },

  getUserById: async (id: string): Promise<UserItem> => {
    const res = await api.get<{ data: UserItem }>(`/users/${id}`);
    return res.data.data;
  },

  createUser: async (payload: Record<string, unknown>): Promise<UserItem> => {
    const res = await api.post<{ data: UserItem }>("/users", payload);
    return res.data.data;
  },

  updateUser: async (id: string, payload: Record<string, unknown>): Promise<UserItem> => {
    const res = await api.put<{ data: UserItem }>(`/users/${id}`, payload);
    return res.data.data;
  },

  toggleUserStatus: async (id: string): Promise<UserItem> => {
    const res = await api.patch<{ data: UserItem; message: string }>(`/users/${id}/toggle-status`);
    return res.data.data;
  },

  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await api.patch(`/users/${id}/reset-password`, { newPassword });
  },
};
