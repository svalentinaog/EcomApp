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
        // 1. Obtenemos al usuario que está haciendo la petición
        $user = $request->user();

        // 2. Gracias a la relación, traemos solo SUS direcciones
        $addresses = $user->addresses;

        // 3. Devolvemos la lista con un código 200 OK
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
        // 1. VALIDAR DATOS
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

        // 2. PREVENIR DUPLICADOS
        $duplicate = $request->user()->addresses()
            ->where('address_line', $validatedData['address_line'])
            ->where('city', $validatedData['city'])
            ->first();

        if ($duplicate) {
            return response()->json([
                'success' => false,
                'message' => 'Ya tienes esta dirección registrada.'], 422);
        }

        // 3. LÓGICA DE DIRECCIÓN PREDETERMINADA
        // Si el usuario quiere que esta sea la principal, desactivamos las anteriores.
        if ($request->boolean('is_default')) {
            $request->user()->addresses()
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        // 4. CREACIÓN Y RESPUESTA
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
        // Buscamos la dirección ÚNICAMENTE dentro de las direcciones de este usuario
        $address = $request->user()->addresses()->find($id); // Ve a las direcciones que le pertenecen a este usuario autenticado y, solo ahí dentro, busca la que tenga este $id

        // Si no existe o es de otro usuario, $address será null
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
        // 1. Buscamos la dirección garantizando que sea de este usuario
        $address = $request->user()->addresses()->find($id);

        // Si el request está vacío, detenemos la ejecución
        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar'], 422);
        }

        if (!$address) {  
            return response()->json([
                'success' => false,
                'message' => 'La dirección que estas intentando actualizar no existe'
            ], 404);
        }

        // 2. Validamos los datos usando 'sometimes'
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

        // 3. DIRECCIÓN PREDETERMINADA
        // Si el usuario quiere marcar esta como 'is_default' (true)
        if ($request->boolean('is_default')) {
            $request->user()->addresses()
                // ¡IMPORTANTE! Excluimos la que dirección estamos editando
                ->where('id', '!=', $id) // Busca todas las direcciones predeterminadas del usuario, pero ignora la que estoy editando en este momento (la del ID que recibí)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        // 4. Actualizamos el registro
        $address->update($validatedData);

        return response()->json([
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

        // Si encontramos la dirección, la eliminamos de la base de datos
        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dirección eliminada exitosamente'
        ], 200);
    }
}


// NOTA:
// SELECT * FROM addresses 
// WHERE user_id = 3                 -- (Esto lo hace $request->user()->addresses())
//   AND address_line = 'Calle Falsa 123'  -- (Este es tu primer where)
//   AND city = 'Cali'               -- (Este es tu segundo where)
// LIMIT 1;                          -- (Esto lo hace el ->first())