<?php

namespace App\Http\Requests;

use App\Constants\ColombianDepartments;
use App\Rules\ColombianPhone;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Cualquier usuario autenticado puede crear/editar direcciones.
        // La comprobación de que la dirección le pertenece (para editar)
        // se hace en el controlador/policy, no aquí.
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        // Sanitiza el texto libre antes de validar (Laravel ya recorta
        // espacios con TrimStrings; aquí además quitamos HTML embebido).
        if ($this->has('complement') && $this->complement !== null) {
            $this->merge(['complement' => strip_tags($this->complement)]);
        }
    }

    public function rules(): array
    {
        return [
            'address_line' => [
                'required', 'string', 'min:5', 'max:255',
                'regex:/^[\p{L}0-9\s#\-.,\/]+$/u',
            ],
            'department' => [
                'required', 'string',
                Rule::in(ColombianDepartments::LIST),
            ],
            'city' => [
                'required', 'string', 'min:3', 'max:100',
                'regex:/^[\p{L}\s\-]+$/u',
            ],
            'neighborhood' => [
                'required', 'string', 'min:2', 'max:100',
                'regex:/^[\p{L}0-9\s.,\-]+$/u',
            ],
            'complement' => [
                'nullable', 'string', 'max:255',
                'regex:/^[\p{L}0-9\s#\-.,\/]*$/u',
            ],
            'recipient_full_name' => [
                'required', 'string', 'min:2', 'max:150',
                'regex:/^[\p{L}\s\'-]+$/u',
            ],
            'phone' => ['required', 'string', new ColombianPhone()],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'address_line.regex' => 'La dirección solo puede contener letras, números, espacios y los caracteres # - . , /',
            'department.in' => 'Selecciona un departamento válido de Colombia.',
            'city.regex' => 'La ciudad solo puede contener letras, espacios y guiones.',
            'neighborhood.regex' => 'El barrio contiene caracteres no permitidos.',
            'complement.regex' => 'El complemento contiene caracteres no permitidos.',
            'recipient_full_name.regex' => 'El nombre del destinatario solo puede contener letras, espacios, guiones y apóstrofes.',
        ];
    }
}
