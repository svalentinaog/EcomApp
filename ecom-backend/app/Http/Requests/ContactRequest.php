<?php

namespace App\Http\Requests;

use App\Rules\ColombianPhone;
use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        // El formulario de contacto es público, cualquiera puede enviarlo.
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
            ],
            'phone' => [
                // Opcional: si lo dejan vacío no se valida el formato.
                'nullable', 'string', new ColombianPhone(),
            ],
            'message' => [
                'required', 'string', 'min:10', 'max:2000',
            ],
            'acceptTerms' => [
                'required', 'accepted',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'El nombre solo puede contener letras, espacios, guiones y apóstrofes.',
            'email.email' => 'Debes ingresar un correo electrónico válido.',
            'message.min' => 'El mensaje debe tener al menos 10 caracteres.',
            'message.max' => 'El mensaje no puede superar los 2000 caracteres.',
            'acceptTerms.required' => 'Debes aceptar la política de privacidad para continuar.',
            'acceptTerms.accepted' => 'Debes aceptar la política de privacidad para continuar.',
        ];
    }
}
