<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SubcategoryRequest; 
use App\Models\Subcategory;

class SubcategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Subcategorías obtenidas correctamente',
            'data'    => Subcategory::with('category')->get() // Añadimos eager loading para traer la categoría relacionada (OPCIONAL)
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SubcategoryRequest $request) 
    {
        // El FormRequest ya validó y sanitizó los datos
        $validatedData = $request->validated();

        $subcategory = Subcategory::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Subcategoría creada exitosamente',
            'data'    => $subcategory->load('category')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $subcategory = Subcategory::with('category')->find($id);

        if (!$subcategory) {
            return response()->json([
                'success' => false,
                'message' => 'La subcategoría que estas intentando ver no existe'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Subcategoría encontrada exitosamente',
            'data'    => $subcategory
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SubcategoryRequest $request, int $id) 
    {
        $subcategory = Subcategory::find($id);

        if (!$subcategory) {
            return response()->json([
                'success' => false,
                'message' => 'La subcategoría que estas intentando actualizar no existe'
            ], 404);
        }

        // El FormRequest maneja tanto la validación completa en store como la parcial en update
        $validatedData = $request->validated();

        $subcategory->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Subcategoría actualizada correctamente',
            'data'    => $subcategory->load('category')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
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