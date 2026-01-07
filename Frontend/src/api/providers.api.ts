import api from "./axios";
import { Provider, UpdateProviderDTO } from "../interfaces";

export const fetchProviders = async (): Promise<Provider[]> => {
  const res = await api.get<Provider[]>("/providers");
  return res.data;
};

export const createProvider = async (data: Partial<Provider>): Promise<Provider> => {
  const res = await api.post<Provider>("/providers", data);
  return res.data;
};

export const updateProvider = async (id: string, data: UpdateProviderDTO): Promise<Provider> => {
  const res = await api.put<Provider>(`/providers/${id}`, data);
  return res.data;
};

export const deleteProvider = async (id: string): Promise<void> => {
  const res = await api.delete(`/providers/${id}`);
  return res.data;
};
