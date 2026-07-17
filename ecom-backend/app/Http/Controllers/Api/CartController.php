<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    // Ver mi carrito
    public function index()
    {
        // auth()->id() nos asegura que el usuario solo vea SU carrito
        // El with('product') trae la info del producto (nombre, precio) gracias a la relación
        $cartItems = CartItem::where('user_id', auth()->id())
                            ->with('product')
                            ->get();

        return response()->json([
            'success' => true,
            'data' => $cartItems
        ], 200);
    }

    // Agregar al carrito
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = auth()->id();
        $productId = $request->product_id;
        $requestedQuantity = $request->quantity;

        // 1. Buscamos el producto para revisar su stock real
        $product = Product::find($productId);

        if ($product->stock < $requestedQuantity) {
            return response()->json([
                'success' => false,
                'message' => 'No hay stock suficiente para este producto. Stock actual: ' . $product->stock
            ], 400);
        }

        // 2. Verificamos si el usuario ya tiene este producto en el carrito
        $cartItem = CartItem::where('user_id', $userId)
                            ->where('product_id', $productId)
                            ->first();

        if ($cartItem) {
            // Si ya existe, sumamos la cantidad solicitada a la que ya tenía
            $newQuantity = $cartItem->quantity + $requestedQuantity;

            // Volvemos a validar el stock por si la suma se pasa
            if ($product->stock < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes agregar más unidades. El stock máximo es: ' . $product->stock
                ], 400);
            }

            $cartItem->quantity = $newQuantity;
            $cartItem->save();

            $message = 'Cantidad actualizada en el carrito';
        } else {
            // Si no existe, creamos el registro nuevo
            $cartItem = CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $requestedQuantity
            ]);

            $message = 'Producto agregado al carrito';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $cartItem
        ], 200);
    }

    // Actualizar la cantidad de un ítem en el carrito
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Buscamos el ítem asegurándonos que le pertenece al usuario logueado
        $cartItem = CartItem::where('id', $id)
                            ->where('user_id', auth()->id())
                            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'El ítem no existe en tu carrito'
            ], 404);
        }

        // Validamos el stock del producto asociado
        $product = $cartItem->product;
        if ($product->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'No hay stock suficiente. Stock actual: ' . $product->stock
            ], 400);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Cantidad actualizada correctamente',
            'data' => $cartItem
        ], 200);
    }

    // Quitar un producto específico del carrito
    public function destroy($id)
    {
        $cartItem = CartItem::where('id', $id)
                            ->where('user_id', auth()->id())
                            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'El ítem no existe en tu carrito'
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado del carrito'
        ], 200);
    }

    // Vaciar todo el carrito
    public function empty()
    {
        CartItem::where('user_id', auth()->id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tu carrito ha sido vaciado'
        ], 200);
    }
}