import { api } from "@/services/api";
import type { CartItem, CartSummary } from "@/types/Cart";

export const cartService = {
  getAll: async (): Promise<{ items: CartItem[]; summary: CartSummary }> => {
    const { data } = await api.get("/cart");

    return {
      items: data.data as CartItem[],
      summary: {
        subtotal: Number(data.summary.subtotal),
        shippingCost: Number(data.summary.shipping_cost),
        total: Number(data.summary.total),
      },
    };
  },

  add: async ({ productId, quantity }: { productId: number; quantity: number }) => {
    await api.post("/cart", { product_id: productId, quantity });
  },

  remove: async (cartId: number) => {
    await api.delete(`/cart/${cartId}`);
  },

  update: async ({ cartId, quantity }: { cartId: number; quantity: number }) => {
    await api.put(`/cart/${cartId}`, { quantity });
  },
};
