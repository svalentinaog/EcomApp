<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('subcategory.category', 'productImages')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'old_price'      => 'nullable|numeric|min:0',
            'discount'       => 'nullable|integer|min:0|max:100',
            'rating'         => 'nullable|integer|min:1|max:5',
            'sku'            => 'required|string|unique:products,sku',
            'stock'          => 'required|integer|min:0',
            'subcategory_id' => 'required|exists:subcategories,id',
            'product_images'       => 'nullable|array',
            'product_images.*'     => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $product = Product::create($validatedData);

        if ($request->hasFile('product_images')) {
            foreach ($request->file('product_images') as $file) {
                $path = $file->store('products', 'public');

                $product->productImages()->create([
                    'url_image' => $path
                ]);
            }
        }

        $product->load('subcategory.category', 'productImages');

        return response()->json([
            'success' => true,
            'message' => 'Producto creado correctamente',
            'data'    => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $product = Product::with(['subcategory.category', 'productImages'])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'El producto que estas intentando ver no existe'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $product = Product::find($id);

        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar'
            ], 422);
        }

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'El producto que estas intentando actualizar no existe'
            ], 404);
        }

        $validatedData = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'description'    => 'nullable|string',
            'price'          => 'sometimes|required|numeric|min:0',
            'old_price'      => 'nullable|numeric|min:0',
            'discount'       => 'nullable|integer|min:0|max:100',
            'rating'         => 'sometimes|integer|min:1|max:5',
            'sku'            => 'sometimes|required|string|unique:products,sku,' . $id,
            'stock'          => 'sometimes|required|integer|min:0',
            'subcategory_id' => 'sometimes|required|exists:subcategories,id',
        ]);

        $product->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Producto actualizado correctamente',
            'data'    => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'El producto que estas intentando eliminar no existe'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado exitosamente'
        ]);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: ProductController y Buenas Prácticas
// - Eager Loading (`with`): Carga relaciones anidadas (ej. subcategory.category)
//   para evitar el problema de consultas N+1 y optimizar el rendimiento.
//
// - Regla `sometimes`: Valida el campo únicamente si viene presente en la petición,
//   lo cual es esencial para actualizaciones parciales.
//
// - Validación `unique` en Update: Se le concatena el ID actual (unique:table,column,id)
//   para evitar que la regla falle al intentar conservar el mismo SKU del producto.
//
// - Inyección de Dependencias: Técnica de diseño que permite a una clase obtener
//   sus dependencias u objetos requeridos desde el exterior (como `Request $request`),
//   en lugar de crearlos internamente.
// =====================================================================
