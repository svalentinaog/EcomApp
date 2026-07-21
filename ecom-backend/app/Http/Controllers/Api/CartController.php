<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cartItems = CartItem::where('user_id', auth()->id())
                            ->with('product')
                            ->get();

        return response()->json([
            'success' => true,
            'data' => $cartItems
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
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

        $product = Product::find($productId);

        if ($product->stock < $requestedQuantity) {
            return response()->json([
                'success' => false,
                'message' => 'No hay stock suficiente para este producto. Stock actual: ' . $product->stock
            ], 400);
        }

        $cartItem = CartItem::where('user_id', $userId)
                            ->where('product_id', $productId)
                            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $requestedQuantity;

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

    /**
     * Update the specified resource in storage.
     */
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

        $cartItem = CartItem::where('id', $id)
                            ->where('user_id', auth()->id())
                            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'El ítem no existe en tu carrito'
            ], 404);
        }

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

    /**
     * Remove the specified resource from storage.
     */
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

    /**
     * Empty the entire cart.
     */
    public function empty()
    {
        CartItem::where('user_id', auth()->id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tu carrito ha sido vaciado'
        ], 200);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: CartController y Lógica de Comercio Electrónico
// - Aislamiento por Usuario (`auth()->id()`): Garantiza que los registros 
//   del carrito estén estrictamente asociados al usuario autenticado, previniendo 
//   vulnerabilidades de acceso cruzado entre cuentas.
//
// - Validación Dinámica de Stock: Compara las cantidades solicitadas (o acumuladas 
//   en caso de repetición) contra el stock disponible en la tabla de productos.
//
// - Eager Loading en Carrito (`with('product')`): Carga la información detallada 
//   del producto asociado a cada ítem del carrito en una sola consulta optimizada.
//
// - Eliminación Masiva Segura (`where('user_id', ...)->delete()`): Permite vaciar 
//   todo el carrito del usuario de forma directa y eficiente en una sola instrucción SQL.
// =====================================================================