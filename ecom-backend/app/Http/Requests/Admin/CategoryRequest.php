<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo administradores gestionan el catálogo.
        // Ajusta 'admin' si tu enum de "role" usa otro valor.
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        // Si tu ruta usa un parámetro distinto a {category}, ajusta esta línea.
        $categoryId = $this->route('category')?->id;

        return [
            'name' => [
                'required', 'string', 'min:2', 'max:100',
                'regex:/^[\p{L}\s\'-]+$/u',
                Rule::unique('categories', 'name')->ignore($categoryId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'El nombre de la categoría solo puede contener letras, espacios, guiones y apóstrofes.',
            'name.unique' => 'Ya existe una categoría con este nombre.',
        ];
    }
}
