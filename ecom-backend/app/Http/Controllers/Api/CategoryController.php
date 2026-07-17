<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // PÚBLICO: Lista todas las categorías CON sus subcategorías
    public function index()
    {
        // 'with' carga la relación definida en tu modelo Category
        $categories = Category::with('subcategories.products')->get();
        return response()->json([
            'success' => true,
            'message' => 'Categorías obtenidas correctamente',
            'data'    => $categories
        ]);
    }

    // SOLO ADMIN: Crear categoría
    public function store(Request $request)
    {
        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos'], 422);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name'
        ]);

        $category = Category::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada exitosamente',
            'data' => $category
        ], 201);
    }

    // PÚBLICO: Ver una categoría específica con sus subcategorías
    public function show($id)
    {
        $category = Category::with('subcategories.products')->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'La Categoría que estas intentando ver no existe'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Categoría obtenida correctamente',
            'data'    => $category
        ], 200);
    }

    // SOLO ADMIN: Actualizar categoría
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'La Categoría que estas intentando actualizar no existe'
            ], 404);
        }

        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar'], 422);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:100|unique:categories,name,' . $category->id
        ]);

        $category->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Categoría actualizada exitosamente',
            'data' => $category
        ], 200);
    }

    // SOLO ADMIN: Eliminar categoría (Borrará las subcategorías en cascada gracias a tu migración)
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'La Categoría que estas intentando eliminar no existe'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoría eliminada exitosamente'
        ], 200);
    }
}