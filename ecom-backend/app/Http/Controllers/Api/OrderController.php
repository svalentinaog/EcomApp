<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Address;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();

        $orders = Order::where('user_id', $userId)
                         ->with('orderItems.product')
                         ->orderBy('created_at', 'desc')
                         ->get();

        return response()->json([
            'success' => true,
            'message' => 'Historial de órdenes obtenido exitosamente.',
            'data'    => $orders
        ], 200);
    }

    public function show($id)
    {
        $order = Order::with('orderItems.product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'La orden no existe.'
            ], 404);
        }

        if ($order->user_id !== auth()->id() && !auth()->user()->is_admin) {
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false, 
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = auth()->id();

        $address = Address::where('id', $request->address_id)
                          ->where('user_id', $userId)
                          ->first();

        if (!$address) {
            return response()->json([
                'success' => false, 
                'message' => 'La dirección seleccionada no es válida o no te pertenece.'
            ], 403);
        }

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
            $shippingCost = 15000;

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
                'status' => 'pending',
                'payment_method' => $request->payment_method,
                'shipping_full_name' => $address->full_name,
                'shipping_phone' => $address->phone,
                'shipping_address_line' => $address->address_line,
                'shipping_city' => $address->city,
                'shipping_state' => $address->state,
                'shipping_postal_code' => $address->postal_code,
                'shipping_country' => $address->country,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
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

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Orden creada exitosamente.',
                'data' => $order->load('orderItems.product')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al procesar tu orden.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Validar datos entrantes.
        // La regla 'in:...' asegura que solo se acepten esos 4 valores exactos.
        $validated = $request->validate([
            'status' => 'required|string|in:pending,shipped,delivered,canceled'
        ]);

        // Buscar orden
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'La orden que intentas actualizar no existe.'
            ], 404);
        }

        $order->update([
            'status' => $validated['status']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Estado de la orden actualizado exitosamente.',
            'data' => $order
        ], 200);
    }
}