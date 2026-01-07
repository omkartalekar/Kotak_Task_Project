import api from "./axios";
import { User, CreateUserDTO, UpdateUserDTO } from "../interfaces";

export const fetchUsers = (): Promise<User[]> => 
  api.get<User[]>("/users").then(res => res.data);

export const createUser = (data: CreateUserDTO): Promise<User> => 
  api.post<User>("/users", data).then(res => res.data);

export const updateUser = (id: string, data: UpdateUserDTO): Promise<User> => 
  api.put<User>(`/users/${id}`, data).then(res => res.data);

export const deleteUser = (id: string): Promise<void> => 
  api.delete(`/users/${id}`).then(res => res.data);
