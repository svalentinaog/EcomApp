import AppRouter from "@/router/AppRouter";
import { CartProvider } from "@/contexts/CartContext";

export default function App() {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  );
}
