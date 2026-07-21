<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('subcategories.products')->get();

        return response()->json([
            'success' => true,
            'message' => 'Categorías obtenidas correctamente',
            'data'    => $categories
        ]);
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
            'name' => 'required|string|max:100|unique:categories,name'
        ]);

        $category = Category::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada exitosamente',
            'data' => $category
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
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
                'message' => 'No se enviaron datos para actualizar'
            ], 422);
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
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

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: CategoryController y Relaciones Anidadas
// - Carga Anidada (Eager Loading con Dot Notation): Uso de `with('subcategories.products')`
//   para recuperar en una sola consulta estructurada tanto las categorías como sus
//   subcategorías y los productos pertenecientes a ellas.
//
// - Validación `unique` en Actualizaciones: Al actualizar registros, se excluye el ID
//   actual (`unique:categories,name,$category->id`) para evitar conflictos falsos de
//   duplicidad cuando el nombre de la categoría permanece sin cambios.
//
// - Control de Solicitudes Vacías: Verificación previa (`empty($request->all())`)
//   para rechazar peticiones que no contengan cargas útiles válidas antes de validar.
//
// - Eliminación en Cascada: El borrado de una categoría padre puede propagarse de forma
//   automatizada a sus subcategorías si se configuró correctamente la restricción de
//   clave foránea en la migración de base de datos.
// =====================================================================
