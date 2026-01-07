import api from "./axios";
import { AuthResponse, LoginDTO, RegisterDTO, User } from "../interfaces";
import { AxiosResponse } from "axios";

export const register = (data: RegisterDTO): Promise<AxiosResponse<AuthResponse>> => 
  api.post("/auth/register", data);

export const login = (data: LoginDTO): Promise<AxiosResponse<AuthResponse>> => 
  api.post("/auth/login", data);

export const getMe = (): Promise<AxiosResponse<User>> => 
  api.get("/auth/me");
