<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users',
            'password'   => 'required|string|min:8|confirmed',
            'birth_date' => 'nullable|date',
        ]);

        $user = User::create([
            'name'       => $validatedData['name'],
            'email'      => $validatedData['email'],
            'password'   => Hash::make($validatedData['password']),
            'role'       => 'customer',
            'birth_date' => $validatedData['birth_date'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ], 201);
    }

    /**
     * Authenticate user and generate token.
     */
    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validatedData['email'])->first();

        if (! $user || ! Hash::check($validatedData['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user->makeHidden(['password'])
        ]);
    }

    /**
     * Revoke the user's current token (Logout).
     */
    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();
        
        if ($token) {
            $token->delete();
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: AuthController y Autenticación con Sanctum
// - Regla `confirmed`: Al aplicarla en un campo (ej. `password`), Laravel 
//   busca automáticamente un campo complementario llamado `password_confirmation` 
//   en el request y verifica que coincidan exactamente.
//
// - Hashing seguro (`Hash::make` / `Hash::check`): Las contraseñas nunca se 
//   almacenan en texto plano; `Hash::make` las encripta de forma irreversible 
//   y `Hash::check` compara seguras las credenciales en el inicio de sesión.
//
// - Laravel Sanctum (`createToken`): Genera tokens de acceso para autenticación 
//   basada en API, devolviendo un `plainTextToken` que el cliente usará en los headers.
//
// - Ocultar datos sensibles (`makeHidden`): Permite excluir dinámicamente atributos 
//   del modelo (como el hash de la contraseña) antes de serializarlos a formato JSON.
// =====================================================================