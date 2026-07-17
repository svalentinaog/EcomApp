<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subcategory;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    // PÚBLICO: Listar subcategorías
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Subcategorías obtenidas correctamente',
            'data'    => Subcategory::all()
        ], 200);
    }

    // SOLO ADMIN: Crear subcategoría
    public function store(Request $request)
    {
        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos'
            ], 422);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            // Validamos que el ID de la categoría exista en la tabla 'categories'
            'category_id' => 'required|integer|exists:categories,id' 
        ]);

        $subcategory = Subcategory::create($validatedData);

        return response()->json([
            'message' => 'Subcategoría creada exitosamente',
            'data' => $subcategory
        ], 201);
    }

    // PÚBLICO: Ver una subcategoría
    public function show($id)
    {
        $subcategory = Subcategory::find($id);

        if (!$subcategory) {
            return response()->json([
                'success' => false,
                'message' => 'La subcategoría que estas intentando ver no existe'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Subcategoría encontrada exitosamente',
            'data' => $subcategory
        ], 200);
    }

    // SOLO ADMIN: Actualizar subcategoría
    public function update(Request $request, $id)
    {
        $subcategory = Subcategory::find($id);

        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar'
            ], 422);
        }
        
        if (!$subcategory) {
            return response()->json([
                'success' => false,
                'message' => 'La subcategoría que estas intentando actualizar no existe'
            ], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'category_id' => 'sometimes|required|integer|exists:categories,id'
        ]);

        $subcategory->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Subcategoría actualizada correctamente',
            'data' => $subcategory
        ], 200);
    }

    // SOLO ADMIN: Eliminar subcategoría
    public function destroy($id)
    {
        $subcategory = Subcategory::find($id);

        if (!$subcategory) {
            return response()->json([
                'success' => false,
                'message' => 'La subcategoría que estas intentando eliminar no existe'
            ], 404);
        }

        $subcategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subcategoría eliminada exitosamente'
        ], 200);
    }
}