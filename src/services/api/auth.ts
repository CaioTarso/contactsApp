import { api } from "./client";
import { LoginRequest, LoginResponse, RegisterRequest } from "../../types";

export async function login(credentials: LoginRequest) {
  const response = await api.post<LoginResponse>("/login", credentials);
  return response.data;
}

export async function register(payload: RegisterRequest) {
  await api.post("/register", payload);
}
