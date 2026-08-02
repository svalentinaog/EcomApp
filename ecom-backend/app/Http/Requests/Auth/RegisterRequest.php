<?php

namespace App\Http\Requests\Auth;

use App\Rules\StrongPassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        // El registro es público.
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required', 'string', 'min:2', 'max:100',
                'regex:/^[\p{L}\s\'-]+$/u',
            ],
            'email' => [
                'required', 'string', 'email:rfc,dns', 'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => [
                'required',
                'confirmed', // exige password_confirmation en el request
                new StrongPassword(),
            ],
            'birth_date' => [
                'required', 'date', 'after:1900-01-01',
                // Edad mínima de 18 años (ecommerce con pagos). Ajusta el
                // número si tu política de negocio permite menores de edad.
                'before_or_equal:' . now()->subYears(18)->format('Y-m-d'),
            ],
            // 'role' se omite a propósito: nunca debe aceptarse desde el
            // cliente. Asígnalo en el controlador (ej: 'customer' fijo).
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'El nombre solo puede contener letras, espacios, guiones y apóstrofes.',
            'email.email' => 'Debes ingresar un correo electrónico válido.',
            'email.unique' => 'Este correo ya está registrado.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'birth_date.before_or_equal' => 'Debes tener al menos 18 años para registrarte.',
            'birth_date.after' => 'La fecha de nacimiento no es válida.',
        ];
    }
}
