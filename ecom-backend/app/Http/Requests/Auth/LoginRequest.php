<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // En login solo se valida formato/presencia, NUNCA la política de
            // contraseña segura: el usuario pudo haber creado su cuenta bajo
            // reglas anteriores, y este no es el lugar para forzar cambios.
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'max:64'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'El correo es obligatorio.',
            'email.email' => 'El formato del correo no es válido.',
            'password.required' => 'La contraseña es obligatoria.',
        ];
    }
}
