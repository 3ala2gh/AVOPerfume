import { api } from "./api";
import type { Product } from "../types/product";

export async function listProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products");
  return data;
}
