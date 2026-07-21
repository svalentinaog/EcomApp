<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subcategory;
use Illuminate\Http\Request;

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
            'data'    => Subcategory::all()
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
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
            'category_id' => 'required|integer|exists:categories,id' 
        ]);

        $subcategory = Subcategory::create($validatedData);

        return response()->json([
            'message' => 'Subcategoría creada exitosamente',
            'data' => $subcategory
        ], 201);
    }

    /**
     * Display the specified resource.
     */
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

    /**
     * Update the specified resource in storage.
     */
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

    /**
     * Remove the specified resource from storage.
     */
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

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: SubcategoryController y Validación Relacional
// - Validación de Existencia Foránea (`exists:categories,id`): Asegura que 
//   cualquier subcategoría creada o modificada esté vinculada a una categoría 
//   válida y existente en la base de datos, resguardando la integridad referencial.
//
// - Reglas Condicionales (`sometimes`): Permiten realizar actualizaciones parciales 
//   eficientes, procesando únicamente los campos enviados en el payload (como `name` 
//   o `category_id`) sin requerir la estructura completa.
//
// - Control Preventivo de Datos Vacíos: La comprobación inicial mediante 
//   `empty($request->all())` rechaza de inmediato solicitudes sin contenido útil, 
//   devolviendo un código HTTP 422 adecuado.
//
// - Manejo de Errores 404 Estándar: Comprobación estricta de la existencia del 
//   recurso mediante `find($id)` previo a cualquier mutación o lectura detallada, 
//   evitando fallos inesperados en el servidor.
// =====================================================================