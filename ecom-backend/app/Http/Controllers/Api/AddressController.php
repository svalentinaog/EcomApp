<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses;

        return response()->json([
            'success' => true,
            'message' => 'Direcciones obtenidas correctamente',
            'data'    => $addresses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'full_name'    => 'required|string|max:255',
            'phone'        => 'required|string|max:20',
            'address_line' => 'required|string|max:255',
            'city'         => 'required|string|max:100',
            'state'        => 'required|string|max:100',
            'postal_code'  => 'required|string|max:20',
            'country'      => 'required|string|max:2',
            'is_default'   => 'boolean',
        ]);

        $duplicate = $request->user()->addresses()
            ->where('address_line', $validatedData['address_line'])
            ->where('city', $validatedData['city'])
            ->first();

        if ($duplicate) {
            return response()->json([
                'success' => false,
                'message' => 'Ya tienes esta dirección registrada.'
            ], 422);
        }

        if ($request->boolean('is_default')) {
            $request->user()->addresses()
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Dirección creada correctamente',
            'data'    => $address
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'La dirección que estas intentando ver no existe'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Dirección obtenida correctamente',
            'data'    => $address
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar'
            ], 422);
        }

        if (!$address) {  
            return response()->json([
                'success' => false,
                'message' => 'La dirección que estas intentando actualizar no existe'
            ], 404);
        }

        $validatedData = $request->validate([
            'full_name'    => 'sometimes|required|string|max:255',
            'phone'        => 'sometimes|required|string|max:20',
            'address_line' => 'sometimes|required|string|max:255',
            'city'         => 'sometimes|required|string|max:100',
            'state'        => 'sometimes|required|string|max:100',
            'postal_code'  => 'sometimes|required|string|max:20',
            'country'      => 'sometimes|required|string|max:2',
            'is_default'   => 'sometimes|boolean',
        ]);

        if ($request->boolean('is_default')) {
            $request->user()->addresses()
                ->where('id', '!=', $id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $address->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Dirección actualizada correctamente.',
            'data'    => $address
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'La dirección que estas intentando eliminar no existe'
            ], 404);
        }

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dirección eliminada exitosamente'
        ], 200);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: AddressController y Seguridad por Relaciones
// - Scoping de Relaciones (`$request->user()->addresses()`): Garantiza 
//   multitenencia y seguridad, asegurando que un usuario solo pueda leer, 
//   actualizar o borrar sus propias direcciones y nunca las de otros.
//
// - Prevención de Duplicados en Consultas Relacionadas: Encadenar condiciones 
//   como `where` y `first` sobre la relación filtra directamente en la base 
//   de datos asociada a ese usuario específico.
//
// - Exclusión en Actualizaciones (`where('id', '!=', $id)`): Clave al manejar 
//   campos únicos o predeterminados (`is_default`), evitando que el propio 
//   registro que estás editando se desactive a sí mismo.
//
// - Traducción a SQL: Llamadas como `$request->user()->addresses()` equivalen 
//   a un filtro automático por clave foránea (`WHERE user_id = ?`).
// =====================================================================