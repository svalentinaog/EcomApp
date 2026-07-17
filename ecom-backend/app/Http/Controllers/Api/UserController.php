<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Listar todos los usuarios
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuarios obtenidos correctamente',
            'data'    => User::all()
        ], 200);
    }

    public function store(Request $request)
    {
        // 1. Validamos los datos
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'birth_date' => 'required|date', // Validar que sea una fecha válida
            'role' => 'required|string|in:admin,customer', // Validar que el rol sea uno de los permitidos
        ]);

        // 2. Creamos el usuario
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']), // cifrar contraseña
            'birth_date' => $validatedData['birth_date'], // Guardar fecha de nacimiento
            'role' => $validatedData['role'],
        ]);

        // 3. Respuesta de éxito
        return response()->json([
            'message' => 'Usuario creado exitosamente por el administrador',
            'data' => $user
        ], 201);
    }

    // Ver un usuario específico
    public function show($id)
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
            'data' => $user
        ], 200);
    }

    // Actualizar usuario
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        // Si el request está vacío, detenemos la ejecución
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

        // 1. Validaciones completas
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|string|in:admin,customer',
            'birth_date' => 'sometimes|date',
            'password' => 'sometimes|string|min:8',
        ]);

        // 2. Extraemos solo los campos seguros permitidos para el admin
        $data = $validatedData;

        // 3. Si el admin decide resetear la contraseña, la encriptamos
        if ($request->filled('password')) {
            $data['password'] = Hash::make($validatedData['password']);
        }

        $user->update($data);
        
        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data' => $user
        ], 200);
    }

    // Actualizar MI propio perfil (Para cualquier usuario de rol "customer" que este logueado)
    public function updateProfile(Request $request)
    {
        // Si el request está vacío, detenemos la ejecución
        if (empty($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar'
            ], 422);
        }

        $user = auth()->user(); // Sabemos quién es por su token, no por la URL

        // 1. Validamos los campos (incluyendo el birth_date de tu diagrama)
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'birth_date' => 'sometimes|date',
            'password' => 'sometimes|string|min:8', // Validamos si envían contraseña
        ]);

        // 2. Extraemos solo los datos permitidos (JAMÁS extraemos el 'role' aquí)
        $data = $request->only(['name', 'email', 'birth_date']);

        // 3. Si el usuario decidió cambiar su contraseña, la encriptamos
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // 4. Actualizamos
        $user->update($data);

        return response()->json([
            'message' => 'Tu perfil ha sido actualizado correctamente',
            'data' => $user
        ], 200);
    }

    // Eliminar usuario
    public function destroy($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario que estas intentando eliminar no existe'
            ], 404);
        }

        // Buena práctica: evitar que el admin se borre a sí mismo accidentalmente
        if ($user->id === auth()->user()->id) {
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