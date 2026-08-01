import { api } from "@/services/api";
import type { CreateOrderPayload, CreateOrderResponse, Order } from "@/types/Order";

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get("/orders");
    return data.data as Order[];
  },

  create: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const { data } = await api.post("/orders", payload);
    return data as CreateOrderResponse;
  },
};
