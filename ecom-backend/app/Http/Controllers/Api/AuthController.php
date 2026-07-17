<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validamos los datos de entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // El "confirmed" es una regla especial: cuando la agregas a un campo password, Laravel automáticamente busca otro campo en el request llamado password_confirmation y los compara.
            'birth_date' => 'nullable|date',
        ]);

        // 2. Creamos el usuario (fuerza el rol 'customer' por seguridad)
        // $user = User::create([
        //     'name' => $request->name,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password), // Encriptamos la contraseña
        //     'role' => 'customer', 
        //     'birth_date' => $request->birth_date,
        // ]);
        
        $user = User::create([
            'name'       => $validatedData['name'],
            'email'      => $validatedData['email'],
            'password'   => Hash::make($validatedData['password']),
            'role'       => 'customer',
            'birth_date' => $validatedData['birth_date'] ?? null,
        ]);

        // 3. Generamos el token de Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Retornamos la respuesta
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validatedData['email'])->first();

        // Verificamos si el usuario existe y la contraseña es correcta
        if (! $user || ! Hash::check($validatedData['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->makeHidden(['password']) // Esto oculta el campo password en la respuesta
        ]);
    }

    public function logout(Request $request)
    {
        // Verificamos si el usuario tiene un token activo antes de intentar borrarlo
        $token = $request->user()->currentAccessToken();
        
        if ($token) {
            $token->delete();
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente'
        ]);
        
        // Borramos el token actual del usuario
        // $request->user()->currentAccessToken()->delete();
        
        // return response()->json([
        //     'message' => 'Sesión cerrada correctamente'
        // ]);
        
    }
}