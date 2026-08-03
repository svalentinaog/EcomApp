<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;

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
    public function store(ProductRequest $request) 
    {
        $validatedData = $request->validated(); 

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
    public function update(ProductRequest $request, int $id) 
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'El producto que estas intentando actualizar no existe'
            ], 404);
        }

        // Eliminamos el if(empty(...)) y el validate manual. 
        // El FormRequest se encarga de todo.

        $validatedData = $request->validated();

        $product->update($validatedData);

        if ($request->hasFile('product_images')) {
            foreach ($request->file('product_images') as $image) {
                $path = $image->store('products', 'public');
                $product->productImages()->create([
                    'url_image' => $path 
                ]);
            }
        }

        // Recargamos las relaciones para devolver el objeto completo y fresco al cliente
        $product->load('subcategory.category', 'productImages');

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

    public function destroyImage(int $id)
    {
        $image = ProductImage::find($id);

        if (!$image) {
            return response()->json([
                'success' => false,
                'message' => 'Imagen no encontrada'
            ], 404);
        }

        Storage::disk('public')->delete($image->url_image);

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Imagen eliminada correctamente'
        ]);
    }
}