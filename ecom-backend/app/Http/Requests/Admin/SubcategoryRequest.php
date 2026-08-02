<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubcategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $subcategoryId = $this->route('subcategory')?->id;

        return [
            'name' => [
                'required', 'string', 'min:2', 'max:100',
                'regex:/^[\p{L}\s\'-]+$/u',
                // Único por categoría (dos categorías distintas SÍ pueden
                // tener una subcategoría con el mismo nombre).
                Rule::unique('subcategories', 'name')
                    ->where(fn ($query) => $query->where('category_id', $this->input('category_id')))
                    ->ignore($subcategoryId),
            ],
            'category_id' => [
                'required', 'integer',
                Rule::exists('categories', 'id'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Ya existe una subcategoría con este nombre en la categoría seleccionada.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
        ];
    }
}
