<?php

namespace App\Http\Requests\Auth;

use App\Rules\StrongPassword;
use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users,email'],
            'password' => ['required', 'confirmed', new StrongPassword()],
        ];
    }

    public function messages(): array
    {
        return [
            'email.exists' => 'No existe una cuenta con este correo.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ];
    }
}
