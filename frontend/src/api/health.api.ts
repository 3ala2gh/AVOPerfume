import { api } from "./api";

export interface HealthResponse {
  status: "ok";
  timestamp: string;
}

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>("/health");
  return data;
}
