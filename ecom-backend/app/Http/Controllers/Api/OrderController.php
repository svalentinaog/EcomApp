<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Address;
use App\Models\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
// --- Importación para Mercado Pago ---
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        $orders = Order::where('user_id', $userId)
                    //    ->where('payment_status', 'approved')
                       ->with('orderItems.product.productImages')
                       ->orderBy('created_at', 'desc')
                       ->get();

        return response()->json([
            'success' => true,
            'message' => 'Historial de órdenes obtenido exitosamente.',
            'data'    => $orders
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $order = Order::with('orderItems.product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'La orden no existe.'
            ], 404);
        }

        if ($order->user_id !== Auth::id() && !Auth::user()->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para acceder a esta orden.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detalle de la orden obtenido exitosamente.',
            'data' => $order
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CheckoutRequest $request)
    {
        // 1. Obtenemos los datos limpios. Si llega aquí, address_id existe y pertenece al usuario.
        $validated = $request->validated();
        
        $userId = Auth::id();

        // 2. Como el Request ya validó que existe y te pertenece, simplemente la buscamos directo.
        $address = Address::find($validated['address_id']);

        $cartItems = CartItem::where('user_id', $userId)->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tu carrito está vacío. No se puede procesar la orden.'
            ], 400);
        }

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $shippingCost = 500;

            foreach ($cartItems as $item) {
                if ($item->product->stock < $item->quantity) {
                    throw new \Exception('No hay stock suficiente para: ' . $item->product->name);
                }
                $subtotal += $item->product->price * $item->quantity;
            }

            $total = $subtotal + $shippingCost;

            $order = Order::create([
                'user_id' => $userId,
                'address_id' => $address->id,
                'payment_status' => 'pending',
                'payment_method' => $validated['payment_method'], // Usamos el dato validado
                'recipient_full_name' => $address->recipient_full_name,
                'phone' => $address->phone,
                'address_line' => $address->address_line,
                'department' => $address->department,
                'city' => $address->city,
                'neighborhood' => $address->neighborhood,
                'complement' => $address->complement,
                'subtotal' => $subtotal,
                'cost' => $shippingCost,
                'total' => $total,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->product->price,
                    'subtotal' => $item->product->price * $item->quantity,
                ]);

                $product = Product::find($item->product_id);
                $product->stock -= $item->quantity;
                $product->save();
            }

            CartItem::where('user_id', $userId)->delete();

            // =====================================================================
            // 👇 Integración con API de Mercado Pago - Inicio
            // =====================================================================
            $itemsForMP = [];
            foreach ($cartItems as $item) {
                $itemsForMP[] = [
                    'title'       => $item->product->name,
                    'quantity'    => $item->quantity, 
                    'unit_price'  => (float) $item->product->price,
                    'currency_id' => 'COP' 
                ];
            }

            if ($shippingCost > 0) {
                $itemsForMP[] = [
                    'title'       => 'Costo de Envío',
                    'quantity'    => 1,
                    'unit_price'  => (float) $shippingCost,
                    'currency_id' => 'COP'
                ];
            }

            $mpResponse = Http::withToken(config('mercadopago.access_token'))
            ->post('https://api.mercadopago.com/checkout/preferences', [

                'items' => $itemsForMP,

                'payer' => [
                    'email' => Auth::user()->email,
                ],

                'back_urls' => [
                    'success' => config('mercadopago.frontend_url') . '/es/profile?tab=orders',
                    'failure' => config('mercadopago.frontend_url') . '/es/make-payment',
                    'pending' => config('mercadopago.frontend_url') . '/es/profile?tab=orders'
                ],

                // 'auto_return' => 'approved',

                'notification_url' => config('mercadopago.webhook_url'),
                'external_reference' => (string) $order->id, 
            ]);

            if ($mpResponse->failed()) {
                throw new \Exception('Error al crear la preferencia en Mercado Pago: ' . $mpResponse->body());
            }

            $preference = $mpResponse->json();

            Log::info('MercadoPago Preference 💰👉', $preference);

            // =====================================================================
            // 👆 Integración con API de Mercado Pago - Fin
            // =====================================================================

            Log::info($itemsForMP);
            Log::info($mpResponse->json());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Orden creada exitosamente.',
                'checkout_url' => $preference['init_point'], // ---Enviar URL al Frontend ---
                'data' => $order->load('orderItems.product')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error al procesar orden: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al procesar tu orden.',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'payment_status' => 'required|string|in:pending,approved,rejected,in_process'
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'La orden que intentas actualizar no existe.'
            ], 404);
        }

        if ($order->user_id !== Auth::id() && !Auth::user()->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para actualizar esta orden.'
            ], 403);
        }

        $order->update([
            'payment_status' => $validated['payment_status']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Estado de pago actualizado exitosamente.',
            'data' => $order
        ], 200);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: OrderController y Procesamiento Transaccional
// - Transacciones de Base de Datos (`DB::beginTransaction`, `DB::commit`, `DB::rollBack`):
//   Aseguran la atomicidad en procesos complejos de e-commerce (crear orden, registrar
//   ítems, descontar stock y vaciar carrito). Si ocurre cualquier error, se revierte
//   todo para evitar estados inconsistentes.
//
// - Snapshot de Dirección: Guardar los datos de envío directamente en la tabla de
//   órdenes (`full_name`, `phone`, `address_line`, `city`, `state`, `postal_code`, `country`) congela la información en el tiempo,
//   protegiendo el registro histórico ante futuros cambios o eliminaciones en el
//   perfil del usuario.
//
// - Control de Acceso Dual en `show`: Permite que tanto el propietario de la orden
//   como un usuario con privilegios de administrador puedan consultar el detalle
//   de la misma de forma segura.
//
// - Regla de Validación `in:...`: Restringe estrictamente los estados permitidos
//   de una orden a un conjunto predefinido (`pending,shipped,delivered,canceled`),
//   evitando entradas de datos corruptas o inválidas.
// =====================================================================