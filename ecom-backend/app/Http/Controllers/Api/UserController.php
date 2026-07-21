<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuarios obtenidos correctamente',
            'data'    => User::all()
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users',
            'password'   => 'required|string|min:8',
            'birth_date' => 'required|date',
            'role'       => 'required|string|in:admin,customer',
        ]);

        $user = User::create([
            'name'       => $validatedData['name'],
            'email'      => $validatedData['email'],
            'password'   => Hash::make($validatedData['password']),
            'birth_date' => $validatedData['birth_date'],
            'role'       => $validatedData['role'],
        ]);

        return response()->json([
            'message' => 'Usuario creado exitosamente por el administrador',
            'data'    => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario que estas intentando ver no existe'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Usuario encontrado exitosamente',
            'data'    => $user
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $user = User::find($id);

        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar'
            ], 422);
        }

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario que estas intentando actualizar no existe'
            ], 404);
        }

        $validatedData = $request->validate([
            'name'       => 'sometimes|string|max:255',
            'email'      => 'sometimes|email|unique:users,email,' . $id,
            'role'       => 'sometimes|string|in:admin,customer',
            'birth_date' => 'sometimes|date',
            'password'   => 'sometimes|string|min:8',
        ]);

        $data = $validatedData;

        if ($request->filled('password')) {
            $data['password'] = Hash::make($validatedData['password']);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data'    => $user
        ], 200);
    }

    /**
     * Update the authenticated user's own profile.
     */
    public function updateProfile(Request $request)
    {
        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar'
            ], 422);
        }

        $user = User::findOrFail(Auth::id());

        $validatedData = $request->validate([
            'name'       => 'sometimes|string|max:255',
            'email'      => 'sometimes|email|unique:users,email,' . $user->id,
            'birth_date' => 'sometimes|date',
            'password'   => 'sometimes|string|min:8',
        ]);

        $data = $request->only(['name', 'email', 'birth_date']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Tu perfil ha sido actualizado correctamente',
            'data'    => $user
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario que estas intentando eliminar no existe'
            ], 404);
        }

        if ($user->id === Auth::user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminarte a ti mismo'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado exitosamente'
        ], 200);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: UserController y Control de Permisos de Usuario
// - Separación de Contextos de Actualización: Distinguir entre la gestión global
//   por parte de un administrador (`update`) y la auto-actualización del propio
//   usuario (`updateProfile`), protegiendo campos críticos como los roles.
//
// - Filtrado Estricto de Atributos (`$request->only`): En el perfil propio,
//   se seleccionan únicamente los campos permitidos para evitar que un cliente
//   malintencionado intente alterar privilegios (como escalar a rol `admin`).
//
// - Prevención de Auto-eliminación: Validación explícita para evitar que un
//   administrador elimine su propia cuenta activa por error (`$user->id === auth()->user()->id`).
//
// - Validación Única con Excepción de ID (`unique:users,email,$id`): Esencial en
//   métodos de actualización para permitir que un usuario mantenga su correo actual
//   sin generar conflictos de duplicidad en la base de datos.
// =====================================================================
